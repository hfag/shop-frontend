import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";

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
import UnsafeHTMLContent from "../components/UnsafeHTMLContent";
import H1 from "../components/H1";

const Page = React.memo(({ language, page = {}, fetchPageIfNeeded }) => {
  useEffect(() => {
    fetchPageIfNeeded();
    trackPageView();
  }, [page]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{stripTags(page.title)} - Hauser Feuerschutz AG</title>
        <meta name="description" content={stripTags(page.description)} />
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${language}/${pathnamesByLanguage[language].page}/${page.slug}`}
        />
      </Helmet>
      <Card>
        <H1 dangerouslySetInnerHTML={{ __html: page.title }} />
        <UnsafeHTMLContent content={page.content} />
      </Card>
    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Page);
