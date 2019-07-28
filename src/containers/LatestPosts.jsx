import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Flex, Box } from "grid-styled";
import { FaPercent } from "react-icons/fa";
import { defineMessages, injectIntl } from "react-intl";
import { connect } from "react-redux";

import Link from "../components/Link";
import Thumbnail from "./Thumbnail";
import { colors, shadows, borders } from "../utilities/style";
import { pathnamesByLanguage } from "../utilities/urls";
import Pagination from "../components/Pagination";
import { fetchAllPostsIfNeeded } from "../actions/posts";
import {
  getLanguageFetchString,
  getPosts,
  getStickyPosts,
  getLanguage
} from "../reducers";

const ITEMS_PER_PAGE = 6;

const messages = defineMessages({
  title: {
    id: "LatestPosts.title",
    defaultMessage: "Aktuelle Beiträge"
  }
});

const SaleWrapper = styled.div`
  position: relative;
  padding: 0.5rem;
  background-color: #fff;
  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};
  word-break: break-word;
  hyphens: auto;

  h3 {
    margin-top: 0;
  }

  p {
    margin: 0;
  }
`;

const Post = React.memo(({ language, post }) => {
  return (
    <Box width={[1, 1, 1 / 2, 1 / 3]} px={2} mt={3}>
      <SaleWrapper>
        <Link
          to={`/${language}/${pathnamesByLanguage[language].post}/${post.slug}`}
        >
          <Flex>
            <Box width={[1, 1, 1 / 2, 1 / 2]} pr={2}>
              <Thumbnail id={post.thumbnailId} />
            </Box>
            <Box width={[1, 1, 1 / 2, 1 / 2]} pl={2}>
              <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
              <div
                dangerouslySetInnerHTML={{
                  __html: post.description
                }}
              />
            </Box>
          </Flex>
        </Link>
      </SaleWrapper>
    </Box>
  );
});

const LatestPosts = React.memo(
  injectIntl(({ language, fetchAllPostsIfNeeded, posts = [], intl }) => {
    const [page, setPage] = useState(0);

    const onPageChange = useCallback(({ selected }) => setPage(selected), [
      setPage
    ]);

    useEffect(() => {
      fetchAllPostsIfNeeded();
    }, []);

    return (
      <div>
        <h2 style={{ marginBottom: 0 }}>
          {intl.formatMessage(messages.title)}
        </h2>
        <Flex flexWrap="wrap">
          {posts
            .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
            .map(post => (
              <Post language={language} post={post} key={post.slug} />
            ))}
        </Flex>
        <Pagination
          pageCount={Math.ceil(posts.length / ITEMS_PER_PAGE)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          previousLabel={"<"}
          nextLabel={">"}
          forcePage={parseInt(page)}
          onPageChange={onPageChange}
        />
      </div>
    );
  })
);

const mapStateToProps = state => {
  const stickyPostIds = getStickyPosts(state).map(p => p.id);

  return {
    language: getLanguage(state),
    languageKey: getLanguageFetchString(state),
    posts: getPosts(state).filter(post => !stickyPostIds.includes(post.id))
  };
};
const mapDispatchToProps = dispatch => ({
  /**
   * Fetches all posts if needed
   * @param {number} perPage The items per page
   * @param {string} language The language key
   * @param {boolean} visualize Whether to visualize the loading
   * @returns {Promise} The fetch promise
   */
  fetchAllPostsIfNeeded(perPage = 20, language, visualize = true) {
    return dispatch(fetchAllPostsIfNeeded(20, language, visualize));
  }
});
const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches all posts if needed
   * @param {number} perPage The items per page
   * @param {boolean} visualize Whether to visualize the loading
   * @returns {Promise} The fetch promise
   */
  fetchAllPostsIfNeeded(perPage = 20, visualize = true) {
    return mapDispatchToProps.fetchAllPostsIfNeeded(
      perPage,
      mapStateToProps.languageKey,
      visualize
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(LatestPosts);