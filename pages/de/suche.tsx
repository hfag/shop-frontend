import { GetStaticPaths, GetStaticProps } from "next";
import { locale, messages } from "./config";
import { FunctionComponent } from "react";
import Wrapper from "../../components/layout/Wrapper";
import { useIntl } from "react-intl";
import { pathnamesByLanguage } from "../../utilities/urls";
import SidebarBreadcrumbs from "../../components/layout/sidebar/SidebarBreadcrumbs";
import SidebarBreadcrumb from "../../components/layout/sidebar/SidebarBreadcrumb";
import { withApp } from "../../components/AppWrapper";
import SearchResults from "../../components/SearchResults";
import { useRouter } from "next/router";

const Page: FunctionComponent<{}> = ({}) => {
  const intl = useIntl();
  const router = useRouter();

  //TODO: translate various strings

  return (
    <Wrapper
      sidebar={
        <>
          <SidebarBreadcrumbs breadcrumbs={[]}>
            <SidebarBreadcrumb active>Suche</SidebarBreadcrumb>
          </SidebarBreadcrumbs>
        </>
      }
      breadcrumbs={[
        {
          name: "Suche",
          url: `/${intl.locale}/${
            pathnamesByLanguage.search.languages[intl.locale]
          }`,
        },
      ]}
    >
      <SearchResults
        term={Array.isArray(router.query.query) ? "" : router.query.query}
      />
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);

export const getStaticPaths: GetStaticPaths = async () => {
  // const data: { collections: { items: Collection[] } } = await request(
  //   locale,
  //   GET_ALL_COLLECTIONS
  // );

  return {
    paths: [] /*data.collections.items.map((collection) => ({
      params: { slug: collection.slug },
    }))*/,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    notFound: false,
    props: {},
  };
};
