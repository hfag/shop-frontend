import { GetStaticPaths, GetStaticProps } from "next";
import { useIntl } from "react-intl";
import { getWordpressUrl } from "../../../utilities/api";
import {
  WP_Post,
  mapPost,
  Post as PostType,
} from "../../../utilities/wordpress";
import { locale, messages } from "../config";
import { FunctionComponent, useMemo } from "react";
import useSWR from "swr";
import Wrapper from "../../../components/layout/Wrapper";
import { pathnamesByLanguage } from "../../../utilities/urls";
import Post from "../../../components/Post";
import SidebarBreadcrumbs from "../../../components/layout/sidebar/SidebarBreadcrumbs";
import SidebarBreadcrumb from "../../../components/layout/sidebar/SidebarBreadcrumb";
import { withApp } from "../../../components/AppWrapper";

const Page: FunctionComponent<{ slug: string; post: PostType }> = ({
  slug,
  post,
}) => {
  const intl = useIntl();

  const { data, error } = useSWR(
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
  // const response: WP_Post[] = await fetch(
  //   `${getWordpressUrl(
  //     locale
  //   )}/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc`
  // ).then((r) => r.json());

  return {
    paths: [], //response.map((post) => ({ params: { slug: post.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    revalidate: 60, //posts will be rerendered at most every minute
    props: {
      slug: context.params.slug,
      post: await fetch(
        `${getWordpressUrl(locale)}/wp-json/wp/v2/posts?slug=${
          context.params.slug
        }&_embed`
      )
        .then((r) => r.json())
        .then((posts: WP_Post[]) => mapPost(posts[0])),
    },
  };
};
