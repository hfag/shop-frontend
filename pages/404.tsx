import React, { useEffect } from "react";
import { defineMessages, useIntl } from "react-intl";

import Head from "next/head";
import Card from "../components/layout/Card";
import { trackPageView } from "../utilities/analytics";
import StyledLink from "../components/elements/StyledLink";
import Searchbar from "../components/Searchbar";
import { ABSOLUTE_URL } from "../utilities/api";
import Wrapper from "../components/layout/Wrapper";
import { GetStaticProps } from "next";

const messages = defineMessages({
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

const Page404 = React.memo(({}) => {
  const intl = useIntl();

  useEffect(() => {
    trackPageView();
  });

  return (
    <Wrapper sidebar={null} breadcrumbs={[{ name: "Error 404", url: " " }]}>
      <Card>
        <Head>
          <title>
            {intl.formatMessage(messages.siteTitle)} - Hauser Feuerschutz AG
          </title>
          <meta
            name="description"
            content={intl.formatMessage(messages.siteDescription)}
          />
          <link rel="canonical" href={`${ABSOLUTE_URL}/${intl.locale}/404`} />
        </Head>
        <h1>{intl.formatMessage(messages.title)}</h1>
        <p>
          {intl.formatMessage(messages.siteNotFound)}{" "}
          <StyledLink external href="mailto:info@feuerschutz.ch">
            info@feuerschutz.ch
          </StyledLink>
          .
        </p>
        <Searchbar />
      </Card>
    </Wrapper>
  );
});

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  };
};

export default Page404;
