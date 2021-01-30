import React, {
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
} from "react";
import styled from "@emotion/styled";
import { FaPercent } from "react-icons/fa";
import { defineMessages, useIntl, IntlShape } from "react-intl";

import { colors, shadows, borders } from "../utilities/style";
import { pathnamesByLanguage } from "../utilities/urls";
import StyledLink from "./elements/StyledLink";
import { WP_BLOG_URL } from "../utilities/api";
import useSWR from "swr";
import Placeholder from "./elements/Placeholder";
import { Post as PostType } from "../utilities/wordpress";
import StyledImage from "./elements/StyledImage";
import Flex from "../components/layout/Flex";
import Box from "./layout/Box";

const messages = defineMessages({
  title: {
    id: "LatestPosts.title",
    defaultMessage: "Aktuelle Beiträge",
  },
});

const PostWrapper = styled.div`
  position: relative;
  padding: 0.5rem;
  background-color: #fff;
  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};
  word-break: break-word;
  hyphens: auto;
  height: 100%;

  h3 {
    margin-top: 0;
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
    font-weight: 300;
  }
`;

const Post: FunctionComponent<{
  intl: IntlShape;
  post?: PostType;
}> = ({ intl, post }) => (
  <Box width={[1 / 2, 1 / 2, 1 / 3, 1 / 3]} paddingX={0.5} marginTop={1}>
    <PostWrapper>
      {post ? (
        <StyledLink
          href={`/${intl.locale}/${
            pathnamesByLanguage.post.languages[intl.locale]
          }/${post.slug}`}
          noHover
        >
          <Flex>
            <Box width={[1, 1, 1 / 2, 1 / 3]} paddingRight={0.5}>
              <StyledImage
                src={post.thumbnail.url}
                width={post.thumbnail.width}
                height={post.thumbnail.height}
                alt={post.thumbnail.alt || post.title}
              />
            </Box>
            <Box width={[1, 1, 1 / 2, 2 / 3]} paddingLeft={0.5}>
              <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
              <p dangerouslySetInnerHTML={{ __html: post.description }} />
            </Box>
          </Flex>
        </StyledLink>
      ) : (
        <Flex>
          <Box width={[1, 1, 1 / 2, 1 / 3]} paddingRight={0.5}>
            <Placeholder block />
          </Box>
          <Box width={[1, 1, 1 / 2, 2 / 3]} paddingLeft={0.5}>
            <Placeholder text height={1.5} mb={1} />
            <Placeholder text height={4} />
          </Box>
        </Flex>
      )}
    </PostWrapper>
  </Box>
);

const LatestPosts: FunctionComponent<{ posts?: PostType[] }> = React.memo(
  ({ posts }) => {
    const intl = useIntl();

    return (
      <div>
        <h2 style={{ marginBottom: 0 }}>
          {intl.formatMessage(messages.title)}
        </h2>
        <Flex flexWrap="wrap" marginX>
          {posts
            ? posts.map((post) => (
                <Post intl={intl} post={post} key={post.slug} />
              ))
            : new Array(6)
                .fill(undefined)
                .map((_) => <Post intl={intl} post={undefined} />)}
        </Flex>
      </div>
    );
  }
);

export default LatestPosts;
