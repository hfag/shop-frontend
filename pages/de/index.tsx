import { GetStaticProps, GetStaticPaths } from "next";
import { FunctionComponent } from "react";
import { useIntl, defineMessages } from "react-intl";
import styled from "@emotion/styled";
import useSWR from "swr";
import { GET_COLLECTION_BY_ID } from "../../gql/collection";
import ProductCollection from "../../components/collection/ProductCollection";
import { Collection, Query } from "../../schema";
import Wrapper from "../../components/layout/Wrapper";
import request from "../../utilities/request";
import { locale, messages } from "./config";
import Card from "../../components/layout/Card";
import StyledLink from "../../components/elements/StyledLink";
import { pathnamesByLanguage, pageSlugsByLanguage } from "../../utilities/urls";
import LatestPosts from "../../components/LatestPosts";
import { Post, WP_Post, mapPost } from "../../utilities/wordpress";
import { WP_BLOG_URL, getWordpressUrl } from "../../utilities/api";
import SaleProducts from "../../components/SaleProducts";
import SidebarBreadcrumbs from "../../components/layout/sidebar/SidebarBreadcrumbs";
import SidebarCollections from "../../components/layout/sidebar/SidebarCollections";
import SidebarProducts from "../../components/layout/sidebar/SidebarProducts";
import SidebarBreadcrumb from "../../components/layout/sidebar/SidebarBreadcrumb";
import { withApp } from "../../components/AppWrapper";

const homeMessages = defineMessages({
  moreAboutCompany: {
    id: "Frontpage.moreAboutCompany",
    defaultMessage: "Mehr über das Unternehmen",
  },
  aboutCompany: {
    id: "Frontpage.aboutCompany",
    defaultMessage:
      "Die 1970 gegründete Firma bietet Ihnen Dienstleistungen und Produkte in den Bereichen Sicherheitskennzeichnung, Trittschutz und Feuerschutz an. Die Faszination der Lumineszenz bewegte uns hin zu einem führenden Schweizer Fachunternehmen für langnachleuchtende Produkte. Als kleines Familienunternehmen sind wir auf Ihre Zufriedenheit angewiesen. Teilen Sie uns Ihre Anliegen mit!",
  },
});

const H1 = styled.h1`
  margin-top: 0;
`;

const H2 = styled.h2`
  margin-bottom: 0;
`;

const Page: FunctionComponent<{
  collectionResponse: { collection: Collection };
  posts: Post[];
}> = ({ collectionResponse, posts }) => {
  const intl = useIntl();

  const { data, error } = useSWR(
    [GET_COLLECTION_BY_ID, 1],
    (query, collectionId) =>
      request<{ collection: Query["collection"] }>(intl.locale, query, {
        id: collectionId,
      }),
    {
      initialData: collectionResponse,
    }
  );

  const {
    data: postsData,
    error: postsError,
  }: {
    data?: Post[];
    error?: any;
  } = useSWR(
    `${getWordpressUrl(
      intl.locale
    )}/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&_embed`,
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((posts: WP_Post[]) => posts.map(mapPost)),
    { initialData: posts }
  );

  return (
    <Wrapper
      sidebar={
        <>
          <SidebarBreadcrumbs breadcrumbs={[]} />
          <SidebarCollections
            collections={data ? data.collection.children : []}
          />
          <SidebarProducts products={data ? data.collection.products : []} />
        </>
      }
      breadcrumbs={[]}
    >
      <SaleProducts
        posts={postsData ? postsData.filter((p) => p.sticky) : postsData}
      />
      <ProductCollection
        collection={data?.collection}
        showDescription={false}
      />
      <LatestPosts
        posts={postsData ? postsData.filter((p) => !p.sticky) : postsData}
      />
      <Card>
        <H1>Hauser Feuerschutz AG</H1>
        <p>{intl.formatMessage(homeMessages.aboutCompany)}</p>
        <StyledLink
          href={`/${intl.locale}/${
            pathnamesByLanguage.page.languages[intl.locale]
          }/${pageSlugsByLanguage.companyAbout.languages[intl.locale]}`}
          underlined
        >
          {intl.formatMessage(homeMessages.moreAboutCompany)}
        </StyledLink>
      </Card>
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    revalidate: 60, //landing page will be rerendered at most every minute
    props: {
      collectionResponse: await request(locale, GET_COLLECTION_BY_ID, {
        id: 1,
      }),
      posts: await fetch(
        `${getWordpressUrl(
          locale
        )}/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&_embed`
      )
        .then((r) => r.json())
        .then((posts: WP_Post[]) => posts.map(mapPost)),
    },
  };
};
