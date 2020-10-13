import React, { useEffect, FunctionComponent } from "react";
import Head from "next/head";
import { stripTags } from "../utilities/decode";
import { ABSOLUTE_URL } from "../utilities/api";
import { pathnamesByLanguage } from "../utilities/urls";
import { Post as PostType } from "../utilities/wordpress";
import { useIntl } from "react-intl";
import Card from "./layout/Card";
import H1 from "./elements/H1";
import UnsafeHTMLContent from "./content/UnsafeHTMLContent";
import Placeholder from "./elements/Placeholder";

const Post: FunctionComponent<{ post?: PostType }> = React.memo(({ post }) => {
  const intl = useIntl();

  return (
    <React.Fragment>
      <Head>
        <title>{stripTags(post.title)} - Hauser Feuerschutz AG</title>
        <meta name="description" content={stripTags(post.description)} />
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${intl.locale}/${
            pathnamesByLanguage.post[intl.locale]
          }/${post.slug}`}
        />
      </Head>
      <Card>
        {post ? (
          <H1 dangerouslySetInnerHTML={{ __html: post.title }} />
        ) : (
          <Placeholder text height={3} />
        )}
        {post ? (
          <UnsafeHTMLContent content={post.content} />
        ) : (
          <Placeholder text height={15} />
        )}
      </Card>
    </React.Fragment>
  );
});

export default Post;
