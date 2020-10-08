import { GetStaticPaths, GetStaticProps } from "next";
import { useIntl } from "react-intl";
import { getWordpressUrl } from "../../../utilities/api";
import {
  mapPage,
  Page as PageType,
  WP_Page,
} from "../../../utilities/wordpress";
import { locale } from "../config.json";
import { FunctionComponent, useMemo } from "react";
import useSWR from "swr";
import Wrapper from "../../../components/layout/Wrapper";
import { pathnamesByLanguage } from "../../../utilities/urls";
import PageComponent from "../../../components/Page";
import SidebarBreadcrumbs from "../../../components/layout/sidebar/SidebarBreadcrumbs";
import SidebarBreadcrumb from "../../../components/layout/sidebar/SidebarBreadcrumb";

const Page: FunctionComponent<{ slug: string; page: PageType }> = ({
  slug,
  page,
}) => {
  const intl = useIntl();

  const { data, error } = useSWR(
    `${getWordpressUrl(intl.locale)}/wp-json/wp/v2/pages?slug=${slug}`,
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((pages: WP_Page[]) => mapPage(pages[0])),
    { initialData: page }
  );

  const breadcrumbs = useMemo(
    () => [
      {
        name: data.title,
        url: `/${intl.locale}/${
          pathnamesByLanguage.post.languages[intl.locale]
        }/${slug}`,
      },
    ],
    [data]
  );

  return (
    <Wrapper
      sidebar={
        <SidebarBreadcrumbs breadcrumbs={[]}>
          {data && <SidebarBreadcrumb active>{data.title}</SidebarBreadcrumb>}
        </SidebarBreadcrumbs>
      }
      breadcrumbs={breadcrumbs}
    >
      <PageComponent page={data} />
    </Wrapper>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  // const response: WP_Page[] = await fetch(
  //   `${getWordpressUrl(
  //     locale
  //   )}/wp-json/wp/v2/pages?per_page=100&orderby=date&order=desc`
  // ).then((r) => r.json());

  return {
    paths: [] /*response.map((page) => ({ params: { slug: page.slug } }))*/,
    fallback: "unstable_blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    revalidate: 60, //pages will be rerendered at most every minute
    props: {
      slug: context.params.slug,
      page: await fetch(
        `${getWordpressUrl(locale)}/wp-json/wp/v2/pages?slug=${
          context.params.slug
        }`
      )
        .then((r) => r.json())
        .then((pages: WP_Page[]) => mapPage(pages[0])),
    },
  };
};
