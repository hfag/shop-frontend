import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";

import Card from "../components/Card";
import {
  getPostBySlug,
  getLanguageFetchString,
  getLanguage
} from "../reducers";
import { fetchPostIfNeeded } from "../actions/posts";
import { stripTags } from "../utilities";
import Thumbnail from "./Thumbnail";
import { pathnamesByLanguage } from "../utilities/urls";
import { trackPageView } from "../utilities/analytics";
import Link from "../components/Link";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

const Post = React.memo(({ language, post = {}, fetchPostIfNeeded }) => {
  useEffect(() => {
    fetchPostIfNeeded();
    trackPageView();
  }, [post]);

  return (
    <Card>
      <Helmet>
        <title>{stripTags(post.title)} - Hauser Feuerschutz AG</title>
        <meta name="description" content={stripTags(post.description)} />
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${language}/${pathnamesByLanguage[language].post}/${post.slug}`}
        />
      </Helmet>
      <h1 dangerouslySetInnerHTML={{ __html: post.title }} />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </Card>
  );
});

const mapStateToProps = (
  state,
  {
    match: {
      params: { postSlug }
    }
  }
) => ({
  language: getLanguage(state),
  languageFetchString: getLanguageFetchString(state),
  post: getPostBySlug(state, postSlug)
});
const mapDispatchToProps = (
  dispatch,
  {
    match: {
      params: { postSlug }
    }
  }
) => ({
  /**
   * Fetches the current post
   * @param {string} language The language string
   * @returns {Promise} The fetch promise
   */
  fetchPostIfNeeded(language) {
    return dispatch(fetchPostIfNeeded(postSlug, language));
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches the current post
   * @returns {Promise} The fetch promise
   */
  fetchPostIfNeeded() {
    return mapDispatchToProps.fetchPostIfNeeded(
      mapStateToProps.languageFetchString
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Post);
