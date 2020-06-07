import { GetStaticProps, GetStaticPaths } from "next";
import { FunctionComponent } from "react";
import { useIntl, defineMessages } from "react-intl";
import { GET_COLLECTION } from "../../gql/collection";
import ProductCollection from "../../components/collection/ProductCollection";
import { Collection } from "../../schema";
import Wrapper from "../../components/layout/Wrapper";
import request from "../../utilities/request";
import { locale } from "./config.json";
import styled from "styled-components";
import Card from "../../components/layout/Card";
import StyledLink from "../../components/elements/StyledLink";
import { pathnamesByLanguage, pageSlugsByLanguage } from "../../utilities/urls";
import LatestPosts from "../../components/LatestPosts";
import { Post, WP_Post, mapPost } from "../../utilities/wordpress";
import useSWR from "swr";
import { WP_BLOG_URL, getWordpressUrl } from "../../utilities/api";
import SaleProducts from "../../components/SaleProducts";

const messages = defineMessages({
  ourProducts: {
    id: "Frontpage.ourProducts",
    defaultMessage: "Unsere Produkte",
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

const H2 = styled.h2`
  margin-bottom: 0;
`;

const Home: FunctionComponent<{
  collectionResponse: { collection: Collection };
  posts: Post[];
}> = ({ collectionResponse, posts }) => {
  const intl = useIntl();

  const { data, error } = useSWR(
    [GET_COLLECTION, 1],
    (query, collectionSlug) =>
      request(intl.locale, query, { id: collectionSlug }),
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
    <Wrapper sidebar={null} breadcrumbs={[]}>
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
        <p>{intl.formatMessage(messages.aboutCompany)}</p>
        <StyledLink
          href={`/${intl.locale}/${
            pathnamesByLanguage.page.languages[intl.locale]
          }/${pageSlugsByLanguage.companyAbout.languages[intl.locale]}`}
          underlined
        >
          {intl.formatMessage(messages.moreAboutCompany)}
        </StyledLink>
      </Card>
    </Wrapper>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      collectionResponse: await request(locale, GET_COLLECTION, { id: 1 }),
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
