import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { getPageBySlug, getLanguageFetchString } from "../reducers";
import { fetchPageIfNeeded } from "../actions/pages";
import { borders, colors } from "../utilities/style";
import UnsafeHTMLContent from "../components/UnsafeHTMLContent";

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
        <UnsafeHTMLContent content={page.content} />
      </InlinePageContainer>
    );
  };
}

const mapStateToProps = (state, { slug: pageSlug }) => ({
  languageFetchString: getLanguageFetchString(state),
  page: getPageBySlug(state, pageSlug),
});
const mapDispatchToProps = (dispatch, { slug: pageSlug }) => ({
  /**
   * Fetches the current post
   * @param {string} language The language string
   * @returns {Promise} The fetch promise
   */
  fetchPageIfNeeded(language) {
    return dispatch(fetchPageIfNeeded(pageSlug, language));
  },
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches the current post
   * @returns {Promise} The fetch promise
   */
  fetchPageIfNeeded() {
    return mapDispatchToProps.fetchPageIfNeeded(
      mapStateToProps.languageFetchString
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(InlinePage);
