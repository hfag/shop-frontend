import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { defineMessages, useIntl } from "react-intl";

import Card from "../components/Card";
import Searchbar from "./Searchbar";
import Link from "../components/Link";
import { getLanguage } from "../reducers";
import { trackPageView } from "../utilities/analytics";

const messages = defineMessages({
  siteTitle: {
    id: "404.siteTitle",
    defaultMessage: "Seite nicht gefunden! Fehler 404 - Hauser Feuerschutz AG"
  },
  siteDescription: {
    id: "404.siteDescription",
    defaultMessage:
      "Diese Seite konnte leider nicht gefunden werden. Verwenden Sie die Suche oder wenden Sie sich an unseren Kundensupport."
  },
  title: {
    id: "404.title",
    defaultMessage: "Fehler 404"
  },
  siteNotFound: {
    id: "404.siteNotFound",
    defaultMessage:
      "Die Seite konnte nicht gefunden werden! Gehen Sie eine Seite zurück oder versuchen Sie es mit der Suche. Vermuten Sie, dies sei ein Fehler, dann kontaktieren Sie uns unter"
  }
});

const Page404 = React.memo(({ language }) => {
  const intl = useIntl();

  useEffect(() => {
    trackPageView();
  });

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
        <link rel="canonical" href={`${ABSOLUTE_URL}/${language}/404`} />
      </Helmet>
      <h1>{intl.formatMessage(messages.title)}</h1>
      <p>
        {intl.formatMessage(messages.siteNotFound)}{" "}
        <Link href="mailto:info@feuerschutz.ch">info@feuerschutz.ch</Link>.
      </p>
      <Searchbar />
    </Card>
  );
});
const mapStateToProps = (state) => ({ language: getLanguage(state) });

export default connect(mapStateToProps)(Page404);
