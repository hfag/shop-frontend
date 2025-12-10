import { Collection, Query } from "../../schema";
import { GET_COLLECTION_BY_ID } from "../../gql/collection";
import { GetStaticProps } from "next";
import {
  PostPreview,
  WP_Post,
  mapPostPreview,
} from "../../utilities/wordpress";
import { defineMessages, useIntl } from "react-intl";
import { getWordpressUrl } from "../../utilities/api";
import { locale, messages } from "./config";
import { pageSlugsByLanguage, pathnamesByLanguage } from "../../utilities/urls";
import { withApp } from "../../components/AppWrapper";
import Card from "../../components/layout/Card";
import LatestPosts from "../../components/LatestPosts";
import ProductCollection from "../../components/collection/ProductCollection";
import React, { FunctionComponent } from "react";
import SaleProducts from "../../components/SaleProducts";
import SidebarBreadcrumbs from "../../components/layout/sidebar/SidebarBreadcrumbs";
import SidebarCollections from "../../components/layout/sidebar/SidebarCollections";
import SidebarProducts from "../../components/layout/sidebar/SidebarProducts";
import StyledLink from "../../components/elements/StyledLink";
import Wrapper from "../../components/layout/Wrapper";
import request from "../../utilities/request";
import styled from "@emotion/styled";
import useSWR from "swr";

const homeMessages = defineMessages({
  shopProducts: {
    id: "Frontpage.shopProducts",
    defaultMessage: "Unsere Produkte im Shop",
  },
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

/*const H2 = styled.h2`
  margin-bottom: 0;
`;*/

const Page: FunctionComponent<{
  collectionResponse: { collection: Collection };
  posts: PostPreview[];
}> = ({ collectionResponse, posts }) => {
  const intl = useIntl();

  const { data /*, error*/ } = useSWR(
    [GET_COLLECTION_BY_ID, 1],
    ([query, collectionId]) =>
      request<{ collection: Query["collection"] }>(intl.locale, query, {
        id: collectionId,
      }),
    {
      fallbackData: collectionResponse,
    }
  );

  const {
    data: postsData,
  }: /*error: postsError,*/
  {
    data?: PostPreview[];
    /*error?: any;*/
  } = useSWR(
    `${getWordpressUrl(
      intl.locale
    )}/wp-json/wp/v2/posts?per_page=20&orderby=date&order=desc&_embed`,
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((posts: WP_Post[]) => posts.map(mapPostPreview)),
    { fallbackData: posts }
  );

  return (
    <Wrapper
      sidebar={
        <>
          <SidebarBreadcrumbs breadcrumbs={[]} />
          <SidebarCollections collections={data?.collection?.children || []} />
          <SidebarProducts products={data?.collection?.products || []} />
        </>
      }
      breadcrumbs={[]}
    >
      <SaleProducts
        posts={postsData ? postsData.filter((p) => p.sticky) : []}
      />
      <h2 style={{ marginBottom: 0 }}>
        {intl.formatMessage(homeMessages.shopProducts)}
      </h2>
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    revalidate: 60 * 60 * 12,
    props: {
      collectionResponse: await request(locale, GET_COLLECTION_BY_ID, {
        id: 1,
      }),
      posts: await fetch(
        `${getWordpressUrl(
          locale
        )}/wp-json/wp/v2/posts?per_page=20&orderby=date&order=desc&_embed`
      )
        .then((r) => r.json())
        .then((posts: WP_Post[]) => posts.map(mapPostPreview)),
    },
  };
};
