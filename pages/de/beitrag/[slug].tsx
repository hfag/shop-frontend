import { GetStaticPaths, GetStaticProps } from "next";
import { useIntl } from "react-intl";
import { getWordpressUrl } from "../../../utilities/api";
import {
  WP_Post,
  mapPost,
  Post as PostType,
} from "../../../utilities/wordpress";
import { locale } from "../config.json";
import { FunctionComponent } from "react";
import useSWR from "swr";
import Wrapper from "../../../components/layout/Wrapper";
import { pathnamesByLanguage } from "../../../utilities/urls";
import Post from "../../../components/Post";

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

  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: post.title,
          url: `/${intl.locale}/${
            pathnamesByLanguage.post.languages[intl.locale]
          }/${slug}`,
        },
      ]}
    >
      <Post post={data} />
    </Wrapper>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  const response: WP_Post[] = await fetch(
    `${getWordpressUrl(
      locale
    )}/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc`
  ).then((r) => r.json());

  return {
    paths: response.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
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
