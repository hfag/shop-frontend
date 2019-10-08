import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { defineMessages, injectIntl, FormattedMessage } from "react-intl";

import Card from "../components/Card";
import { getLanguage } from "../reducers";
import Link from "../components/Link";
import { pathnamesByLanguage } from "../utilities/urls";
import { trackPageView } from "../utilities/analytics";

const messages = defineMessages({
  siteTitle: {
    id: "Confirmation.siteTitle",
    defaultMessage: "Bestellbestätigung - Hauser Feuerschutz AG"
  },
  siteDescription: {
    id: "Confirmation.siteDescription",
    defaultMessage: "Bestätigungsseite nach einer Bestellung"
  },
  title: {
    id: "Confirmation.title",
    defaultMessage: "Bestellbestätigung"
  },
  message: {
    id: "Confirmation.message",
    defaultMessage:
      "Vielen Dank für Ihre Bestellung bei der Hauser Feuerschutz AG. Sie werden in Kürze eine Bestätigungsemail erhalten."
  }
});

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

const Confirmation = React.memo(
  injectIntl(({ language, intl }) => {
    useEffect(() => {
      trackPageView();
    });

    return (
      <Card>
        <Helmet>
          <title>{intl.formatMessage(messages.siteTitle)}</title>
          <meta
            name="description"
            content={intl.formatMessage(messages.siteDescription)}
          />
          <link
            rel="canonical"
            href={`${ABSOLUTE_URL}/${language}/${pathnamesByLanguage[language].confirmation}`}
          />
        </Helmet>
        <h1>{intl.formatMessage(messages.title)}</h1>
        <p>{intl.formatMessage(messages.message)}</p>
        <p>
          <FormattedMessage
            id="Confirmation.support"
            defaultMessage="Bei Fragen können sie uns per E-Mail unter {mail} oder per Telefon unter {phone} erreichen."
            values={{
              mail: (
                <Link href="mailto:info@feuerschutz.ch">
                  info@feuerschutz.ch
                </Link>
              ),
              phone: <Link href="tel:+41628340540">062 834 05 40</Link>
            }}
          />
        </p>
      </Card>
    );
  })
);

const mapStateToProps = state => ({ language: getLanguage(state) });

export default connect(mapStateToProps)(Confirmation);
