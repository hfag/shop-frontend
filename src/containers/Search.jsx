import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import { defineMessages, injectIntl } from "react-intl";
import { connect } from "react-redux";

import Card from "../components/Card";
import { getLanguage } from "../reducers";
import SkuSelection from "./SkuSelection";
import { pathnamesByLanguage } from "../utilities/urls";
import { trackPageView } from "../utilities/analytics";

const messages = defineMessages({
  siteTitle: {
    id: "Search.siteTitle",
    defaultMessage: "Suchen Sie im Shop der Hauser Feuerschutz AG"
  },
  siteDescription: {
    id: "Search.siteDescription",
    defaultMessage:
      "Suchen Sie im Shop der Hauser Feuerschutz AG nach Produkten wie dem Rettungswegschild oder nach Kategorien wie den Brandschutzzeichen."
  }
});

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

const Search = React.memo(
  injectIntl(({ language, intl }) => {
    const { query } = queryString.parse(location.search);

    useEffect(() => {
      trackPageView();
    }, []);

    return (
      <Card>
        <Helmet>
          <title>
            {intl.formatMessage(messages.siteTitle)} - Hauser Feuerschutz AG
          </title>
          <meta
            name="description"
            content={intl.formatMessage(messages.siteDescription)}
          />
          <link
            rel="canonical"
            href={`${ABSOLUTE_URL}/${pathnamesByLanguage[language].search}`}
          />
        </Helmet>
        <SkuSelection query={query} />
      </Card>
    );
  })
);

const mapStateToProps = state => ({
  language: getLanguage(state)
});

export default connect(mapStateToProps)(Search);
