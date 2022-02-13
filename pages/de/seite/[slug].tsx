import { GetStaticPaths, GetStaticProps } from "next";
import {
  Page as PageType,
  WP_Page,
  mapPage,
} from "../../../utilities/wordpress";
import { getWordpressUrl } from "../../../utilities/api";
import { locale, messages } from "../config";
import { pathnamesByLanguage } from "../../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../../components/AppWrapper";
import PageComponent from "../../../components/Page";
import React, { FunctionComponent, useMemo } from "react";
import SidebarBreadcrumb from "../../../components/layout/sidebar/SidebarBreadcrumb";
import SidebarBreadcrumbs from "../../../components/layout/sidebar/SidebarBreadcrumbs";
import Wrapper from "../../../components/layout/Wrapper";
import useSWR from "swr";

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

export default withApp(locale, messages)(Page);

export const getStaticPaths: GetStaticPaths = async () => {
  const response: WP_Page[] = await fetch(
    `${getWordpressUrl(
      locale
    )}/wp-json/wp/v2/pages?per_page=100&orderby=date&order=desc`
  ).then((r) => r.json());

  return {
    paths: response.map((page) => ({ params: { slug: page.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let notFound = false;
  let page = null;

  try {
    page = await fetch(
      `${getWordpressUrl(locale)}/wp-json/wp/v2/pages?slug=${
        context.params.slug
      }`
    )
      .then((r) => r.json())
      .then((pages: WP_Page[]) => mapPage(pages[0]));

    if (!page) {
      notFound = true;
    }
  } catch (e) {
    notFound = true;
    page = null;
  }

  return {
    revalidate: 60, //pages will be rerendered at most every minute
    notFound,
    props: {
      slug: context.params.slug,
      page,
    },
  };
};
