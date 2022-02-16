import { GetStaticPaths, GetStaticProps } from "next";
import {
  Post as PostType,
  WP_Post,
  mapPost,
} from "../../../utilities/wordpress";
import { getWordpressUrl } from "../../../utilities/api";
import { locale, messages } from "../config";
import { pathnamesByLanguage } from "../../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../../components/AppWrapper";
import Post from "../../../components/Post";
import React, { FunctionComponent, useMemo } from "react";
import SidebarBreadcrumb from "../../../components/layout/sidebar/SidebarBreadcrumb";
import SidebarBreadcrumbs from "../../../components/layout/sidebar/SidebarBreadcrumbs";
import Wrapper from "../../../components/layout/Wrapper";
import useSWR from "swr";

const Page: FunctionComponent<{ slug: string; post: PostType }> = ({
  slug,
  post,
}) => {
  const intl = useIntl();

  const { data /*, error*/ } = useSWR(
    `${getWordpressUrl(intl.locale)}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((posts: WP_Post[]) => mapPost(posts[0])),
    { initialData: post }
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
      <Post post={data} />
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);

export const getStaticPaths: GetStaticPaths = async () => {
  const response: WP_Post[] = await fetch(
    `${getWordpressUrl(
      locale
    )}/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc`
  ).then((r) => r.json());

  return {
    paths: response.map((post) => ({ params: { slug: post.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let notFound = false;
  let post = null;

  try {
    post = await fetch(
      `${getWordpressUrl(locale)}/wp-json/wp/v2/posts?slug=${
        context.params.slug
      }&_embed`
    )
      .then((r) => r.json())
      .then((posts: WP_Post[]) => mapPost(posts[0]));

    if (!post) {
      notFound = true;
    }
  } catch (e) {
    console.log(e);
    notFound = true;
    post = null;
  }

  return {
    revalidate: 60, //posts will be rerendered at most every minute
    notFound,
    props: {
      slug: context.params.slug,
      post,
    },
  };
};
