import React from "react";
import { Helmet } from "react-helmet";

import Card from "../components/Card";
import {
  getProductSearchSections,
  getLastProductSearchQuery
} from "../reducers";
import Link from "../components/Link";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * The confirmation page
 * @returns {Component} The component
 */
class Confirmation extends React.PureComponent {
  render = () => {
    return (
      <Card>
        <Helmet>
          <title>Bestellbestätigung - Hauser Feuerschutz AG</title>
          <meta
            name="description"
            content="Bestätigungsseite nach einer Bestellung"
          />
          <link rel="canonical" href={ABSOLUTE_URL + "/bestaetigung"} />
        </Helmet>
        <h1>Bestellbestätigung</h1>
        <p>
          Vielen Dank für Ihre Bestellung bei der Hauser Feuerschutz AG. Sie
          werden in Kürze eine Bestätigungsemail erhalten.
        </p>
        <p>
          Bei Fragen können sie uns per E-Mail unter{" "}
          <Link href="mailto:info@feuerschutz.ch">info@feuerschutz.ch</Link>{" "}
          oder per Telefon unter{" "}
          <Link href="tel:+41628340540">062 834 05 40</Link> erreichen.
        </p>
      </Card>
    );
  };
}

export default Confirmation;
