import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Flex, Box } from "grid-styled";

import Card from "../components/Card";
import { getPostBySlug } from "../reducers";
import { fetchPostBySlug } from "../actions/posts";
import { stripTags } from "../utilities";
import Thumbnail from "./Thumbnail";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * The search page
 * @returns {Component} The component
 */
class Post extends React.PureComponent {
  componentDidMount = () => {
    const { post, fetchPost } = this.props;
    if (!post) {
      fetchPost();
    }
  };
  render = () => {
    const { post = {} } = this.props;
    return (
      <Card>
        <Helmet>
          <title>{post.title}</title>
          <meta name="description" content={stripTags(post.description)} />
          <link rel="canonical" href={ABSOLUTE_URL + "/" + post.slug} />
        </Helmet>
        <h1>{post.title}</h1>
        <Flex>
          <Box width={[1 / 2, 1 / 2, 1 / 4, 1 / 4]}>
            <Thumbnail id={post.thumbnailId} />
          </Box>
        </Flex>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </Card>
    );
  };
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { postSlug }
    }
  }
) => ({
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
   * @returns {Promise} The fetch promise
   */
  fetchPost() {
    return dispatch(fetchPostBySlug(postSlug));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post);
