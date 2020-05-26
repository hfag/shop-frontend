//styles
import "../styles/global.scss";
//analytics script
import "../utilities/analytics";
import "../utilities/set-yup-locale";

//dependencies
import App, { AppProps } from "next/app";
import { createIntl, createIntlCache, RawIntlProvider } from "react-intl";
import { MessageFormatElement } from "intl-messageformat-parser";
import { SWRConfig } from "swr";
import { request } from "graphql-request";
import React from "react";

import messagesDe from "../locales/de.json";
import messagesFr from "../locales/fr.json";
import { API_URL } from "../utilities/api";

// const presistedState: AppState = {
//   ...(window["__INITIAL_DATA__"] || {}),
// };

// const store = createStore(
//   appReducer,
//   presistedState,
//   composeWithDevTools(
//     applyMiddleware(
//       thunkMiddleware,
//       /* show loading animation */
//       (store) => (next) => (action) => {
//         if (action.visualize === true) {
//           store.dispatch(action.isFetching ? showLoading() : hideLoading());
//         }
//         return next(action);
//       }
//     )
//   )
// );

//storing *some* keys of the application state in the localstorage
/*store.subscribe(
  throttle(() => {
    const { account, isAuthenticated } = store.getState();
    saveState({
      account,
      isAuthenticated,
    });
  }, 1000)
);*/

declare global {
  interface Window {
    __NEXT_DATA__: { [key: string]: any };
  }
}

const MESSAGES = {
  ...messagesDe,
  ...messagesFr
};

const cache = createIntlCache();

export default class MyApp extends App<{
  locale: string;
  messages: Record<string, string> | Record<string, MessageFormatElement[]>;
}> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // Get the `locale` and `messages` from the request object on the server.
    // In the browser, use the same values that the server serialized.
    const { req } = ctx;
    const { locale, messages } = req || window.__NEXT_DATA__.props;

    return { pageProps, locale, messages };
  }

  render() {
    const { Component, pageProps, locale, messages } = this.props;

    const intl = createIntl(
      {
        locale: locale || "de",
        messages
      },
      cache
    );

    return (
      <RawIntlProvider value={intl}>
        <SWRConfig
          value={{
            fetcher: (
              [query, token]: [string, string],
              variables: { [key: string]: any }
            ) => request(API_URL, query, variables)
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </RawIntlProvider>
    );
  }
}
