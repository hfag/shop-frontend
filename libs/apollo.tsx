import React, { ReactNode } from "react";
import App, { AppContext } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { NextPageContext, NextPage } from "next";
import createApolloClient from "../apollo-client";

interface NextPageContextWithApollo extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject> | null;
  apolloState: NormalizedCacheObject;
  ctx: NextPageContextApp;
}

type NextPageContextApp = NextPageContextWithApollo & AppContext;

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let globalApolloClient: ApolloClient<NormalizedCacheObject> | null = null;

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {NormalizedCacheObject} initialState
 * @param  {NextPageContext} ctx
 */
const initApolloClient = (
  initialState: NormalizedCacheObject,
  ctx?: NextPageContext
) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === "undefined") {
    return createApolloClient(initialState, ctx);
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, ctx);
  }

  return globalApolloClient;
};

/**
 * Installs the Apollo Client on NextPageContext
 * or NextAppContext. Useful if you want to use apolloClient
 * inside getStaticProps, getStaticPaths or getServerSideProps
 * @param {NextPageContext | NextAppContext} ctx
 */
export const initOnContext = (ctx: NextPageContextApp): NextPageContextApp => {
  const inAppContext = Boolean(ctx.ctx);

  // We consider installing `withApollo({ ssr: true })` on global App level
  // as antipattern since it disables project wide Automatic Static Optimization.
  if (process.env.NODE_ENV === "development") {
    if (inAppContext) {
      console.warn(
        "Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n" +
          "Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n"
      );
    }
  }

  // Initialize ApolloClient if not already done
  // https://github.com/zeit/next.js/issues/9542
  const apolloClient =
    ctx.apolloClient ||
    initApolloClient(ctx.apolloState || {}, inAppContext ? ctx.ctx : ctx);

  // We send the Apollo Client as a prop to the component to avoid calling initApollo() twice in the server.
  // Otherwise, the component would have to call initApollo() again but this
  // time without the context. Once that happens, the following code will make sure we send
  // the prop as `null` to the browser.
  const withToJSONApolloClient = apolloClient as ApolloClient<
    NormalizedCacheObject
  > & { toJSON: () => null };

  withToJSONApolloClient.toJSON = () => null;

  // Add apolloClient to NextPageContext & NextAppContext.
  // This allows us to consume the apolloClient inside our
  // custom `getInitialProps({ apolloClient })`.
  ctx.apolloClient = withToJSONApolloClient;
  if (inAppContext) {
    ctx.ctx.apolloClient = withToJSONApolloClient;
  }

  return ctx;
};

/**
 * Creates a withApollo HOC
 * that provides the apolloContext
 * to a next.js Page or AppTree.
 * @param  {Object} withApolloOptions
 * @param  {Boolean} [withApolloOptions.ssr=false]
 * @returns {(PageComponent: ReactNode) => ReactNode}
 */
export const withApollo = ({ ssr = false } = {}) => (
  PageComponent: NextPage
): ReactNode => {
  const WithApollo = ({
    apolloClient,
    apolloState,
    ...pageProps
  }: {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    apolloState: NormalizedCacheObject;
  }): ReactNode => {
    let client;
    if (apolloClient) {
      // Happens on: getDataFromTree & next.js ssr
      client = apolloClient;
    } else {
      // Happens on: next.js csr
      client = initApolloClient(apolloState, undefined);
    }

    return (
      <ApolloProvider client={client}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";
    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (
      ctx: NextPageContextApp
    ): Promise<object> => {
      const inAppContext = Boolean(ctx.ctx);
      const { apolloClient } = initOnContext(ctx);

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      } else if (inAppContext) {
        pageProps = await App.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === "undefined") {
        const { AppTree } = ctx;
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if dataFromTree is enabled
        if (ssr && AppTree) {
          try {
            // Import `@apollo/react-ssr` dynamically.
            // We don't want to have this in our client bundle.
            const { getDataFromTree } = await import("@apollo/react-ssr").then(
              (m) => m
            );

            // Since AppComponents and PageComponents have different context types
            // we need to modify their props a little.
            let props: any;
            if (inAppContext) {
              props = { ...pageProps, apolloClient };
            } else {
              props = { pageProps: { ...pageProps, apolloClient } };
            }

            // Take the Next.js AppTree, determine which queries are needed to render,
            // and fetch them. This method can be pretty slow since it renders
            // your entire AppTree once for every query. Check out apollo fragments
            // if you want to reduce the number of rerenders.
            // https://www.apollographql.com/docs/react/data/fragments/
            // eslint-disable-next-line react/jsx-props-no-spreading
            await getDataFromTree(<AppTree {...props} />);
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error("Error while running `getDataFromTree`", error);
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      return {
        ...pageProps,
        // Extract query data from the Apollo store
        apolloState: apolloClient?.cache.extract(),
        // Provide the client for ssr. As soon as this payload
        apolloClient: ctx.apolloClient,
      };
    };
  }

  return WithApollo;
};
