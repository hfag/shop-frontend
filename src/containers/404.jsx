import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

import Card from "../components/Card";
import Searchbar from "./Searchbar";
import Link from "../components/Link";
import { getLanguage } from "../reducers";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

const Page404 = React.memo(({ language }) => {
  return (
    <Card>
      <Helmet>
        <title>Seite nicht gefunden! Fehler 404 - Hauser Feuerschutz AG</title>
        <meta
          name="description"
          content="Diese Seite konnte leider nicht gefunden werden. Verwenden Sie die Suche oder wenden Sie sich an unseren Kundensupport."
        />
        <link rel="canonical" href={`${ABSOLUTE_URL}/${language}/404`} />
      </Helmet>
      <h1>Fehler 404</h1>
      <p>
        Die Seite konnte nicht gefunden werden! Gehen Sie eine Seite zurück oder
        versuchen Sie es mit der Suche. Denken Sie das ist ein Fehler,
        kontaktieren Sie uns unter{" "}
        <Link href="mailto:info@feuerschutz.ch">info@feuerschutz.ch</Link>.
      </p>
      <Searchbar />
    </Card>
  );
});
const mapStateToProps = state => ({ language: getLanguage(state) });

export default connect(mapStateToProps)(Page404);
