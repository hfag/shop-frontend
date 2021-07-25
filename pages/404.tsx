import { defineMessages, useIntl } from "react-intl";
import React, { useEffect } from "react";

import { ABSOLUTE_URL } from "../utilities/api";
import { GetStaticProps } from "next";
import { locale, messages } from "./de/config";
import { trackPageView } from "../utilities/analytics";
import { withApp } from "../components/AppWrapper";
import Card from "../components/layout/Card";
import Head from "next/head";
import Searchbar from "../components/Searchbar";
import StyledLink from "../components/elements/StyledLink";
import Wrapper from "../components/layout/Wrapper";

const errorMessages = defineMessages({
  siteTitle: {
    id: "404.siteTitle",
    defaultMessage: "Seite nicht gefunden! Fehler 404 - Hauser Feuerschutz AG",
  },
  siteDescription: {
    id: "404.siteDescription",
    defaultMessage:
      "Diese Seite konnte leider nicht gefunden werden. Verwenden Sie die Suche oder wenden Sie sich an unseren Kundensupport.",
  },
  title: {
    id: "404.title",
    defaultMessage: "Fehler 404",
  },
  siteNotFound: {
    id: "404.siteNotFound",
    defaultMessage:
      "Die Seite konnte nicht gefunden werden! Gehen Sie eine Seite zurück oder versuchen Sie es mit der Suche. Vermuten Sie, dies sei ein Fehler, dann kontaktieren Sie uns unter",
  },
});

const Page404 = React.memo(() => {
  const intl = useIntl();

  useEffect(() => {
    trackPageView();
  });

  return (
    <Wrapper sidebar={null} breadcrumbs={[{ name: "Error 404", url: " " }]}>
      <Card>
        <Head>
          <title>
            {intl.formatMessage(errorMessages.siteTitle)} - Hauser Feuerschutz
            AG
          </title>
          <meta
            name="description"
            content={intl.formatMessage(errorMessages.siteDescription)}
          />
          <link rel="canonical" href={`${ABSOLUTE_URL}/${intl.locale}/404`} />
        </Head>
        <h1>{intl.formatMessage(errorMessages.title)}</h1>
        <p>
          {intl.formatMessage(errorMessages.siteNotFound)}{" "}
          <StyledLink external href="mailto:info@feuerschutz.ch">
            info@feuerschutz.ch
          </StyledLink>
          .
        </p>
        <Searchbar id="404" />
      </Card>
    </Wrapper>
  );
});

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  };
};

export default withApp(locale, messages)(Page404);
