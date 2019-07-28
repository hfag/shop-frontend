import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

import Card from "../components/Card";
import {
  getPageBySlug,
  getLanguage,
  getLanguageFetchString
} from "../reducers";
import { fetchPageIfNeeded } from "../actions/pages";
import { stripTags } from "../utilities";
import { pathnamesByLanguage } from "../utilities/urls";
import { trackPageView } from "../utilities/analytics";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

const Page = React.memo(({ language, page = {}, fetchPageIfNeeded }) => {
  useEffect(() => {
    fetchPageIfNeeded();
    trackPageView();
  }, [page]);

  return (
    <Card>
      <Helmet>
        <title>{stripTags(page.title)}</title>
        <meta name="description" content={stripTags(page.description)} />
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${language}/${
            pathnamesByLanguage[language].page
          }/${page.slug}`}
        />
      </Helmet>
      <h1 dangerouslySetInnerHTML={{ __html: page.title }} />
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </Card>
  );
});

const mapStateToProps = (
  state,
  {
    match: {
      params: { pageSlug }
    }
  }
) => ({
  language: getLanguage(state),
  languageFetchString: getLanguageFetchString(state),
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
   * @param {string} language The language string
   * @returns {Promise} The fetch promise
   */
  fetchPageIfNeeded(language) {
    return dispatch(fetchPageIfNeeded(pageSlug, language));
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
  fetchPageIfNeeded() {
    return mapDispatchToProps.fetchPageIfNeeded(
      mapStateToProps.languageFetchString
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Page);
