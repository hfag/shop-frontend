import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { getPageBySlug } from "../reducers";
import { fetchPageIfNeeded } from "../actions/pages";
import { borders, colors } from "../utilities/style";

const InlinePageContainer = styled.div`
  max-height: 200px;
  background-color: #eee;
  overflow: scroll;
  padding: 0 1rem;
  margin-bottom: 1rem;
  border-radius: ${borders.radius};
  border: ${colors.secondary} 1px solid;
`;

/**
 * The page for pages, wow how poetic
 * @returns {Component} The component
 */
class InlinePage extends React.PureComponent {
  componentDidMount = () => {
    const { page, fetchPageIfNeeded } = this.props;
    if (!page) {
      fetchPageIfNeeded();
    }
  };
  render = () => {
    const { page = {} } = this.props;
    return (
      <InlinePageContainer>
        <h1 dangerouslySetInnerHTML={{ __html: page.title }} />
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </InlinePageContainer>
    );
  };
}

const mapStateToProps = (state, { slug: pageSlug }) => ({
  page: getPageBySlug(state, pageSlug)
});
const mapDispatchToProps = (dispatch, { slug: pageSlug }) => ({
  /**
   * Fetches the current post
   * @returns {Promise} The fetch promise
   */
  fetchPageIfNeeded() {
    return dispatch(fetchPageIfNeeded(pageSlug));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InlinePage);
