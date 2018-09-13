import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

import Card from "../components/Card";
import { getPageBySlug } from "../reducers";
import { fetchPageIfNeeded } from "../actions/pages";
import { stripTags } from "../utilities";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * The page for pages, wow how poetic
 * @returns {Component} The component
 */
class Page extends React.PureComponent {
  componentDidMount = () => {
    const { page, fetchPageIfNeeded } = this.props;
    if (!page) {
      fetchPageIfNeeded();
    }
  };
  render = () => {
    const { page = {} } = this.props;
    return (
      <Card>
        <Helmet>
          <title>{stripTags(page.title)}</title>
          <meta name="description" content={stripTags(page.description)} />
          <link rel="canonical" href={ABSOLUTE_URL + "/" + page.slug} />
        </Helmet>
        <h1 dangerouslySetInnerHTML={{ __html: page.title }} />
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </Card>
    );
  };
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { pageSlug }
    }
  }
) => ({
  page: getPageBySlug(state, pageSlug)
});
const mapDispatchToProps = (
  dispatch,
  {
    match: {
      params: { pageSlug }
    }
  }
) => ({
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
)(Page);
