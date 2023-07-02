import { ABSOLUTE_URL } from "../utilities/api";
import { Post as PostType } from "../utilities/wordpress";
import { pathnamesByLanguage } from "../utilities/urls";
import { stripTags } from "../utilities/decode";
import { useIntl } from "react-intl";
import Block from "./content/Block";
import Card from "./layout/Card";
import H1 from "./elements/H1";
import Head from "next/head";
import Placeholder from "./elements/Placeholder";
import React, { FunctionComponent } from "react";

const Post: FunctionComponent<{ post?: PostType }> = React.memo(({ post }) => {
  const intl = useIntl();

  return (
    <>
      {post && (
        <Head>
          <title key="title">{`${stripTags(
            post.title
          )} - Hauser Feuerschutz AG`}</title>
          <link
            rel="canonical"
            href={`${ABSOLUTE_URL}/${intl.locale}/${
              pathnamesByLanguage.post[intl.locale]
            }/${post.slug}`}
          />
        </Head>
      )}
      <Card>
        {post ? (
          <H1 dangerouslySetInnerHTML={{ __html: post.title }} />
        ) : (
          <Placeholder text height={3} />
        )}
        {post && post.blocks ? (
          post.blocks.map((block, index) => (
            <Block key={index} block={block}></Block>
          ))
        ) : (
          <Placeholder text height={15} />
        )}
      </Card>
    </>
  );
});

export default Post;
