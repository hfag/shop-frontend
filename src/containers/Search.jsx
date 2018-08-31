import React from "react";
import { Helmet } from "react-helmet";

import Card from "../components/Card";
import Searchbar from "./Searchbar";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * The search page
 * @returns {Component} The component
 */
class Search extends React.PureComponent {
  render = () => {
    return (
      <Card>
        <Helmet>
          <title>Suchen Sie im Shop der Hauser Feuerschutz AG</title>
          <meta
            name="description"
            content="Suchen Sie im Shop der Hauser Feuerschutz AG nach Produkten wie dem Rettungswegschild oder nach Kategorien wie den Brandschutzzeichen."
          />
          <link rel="canonical" href={ABSOLUTE_URL + "/suche"} />
        </Helmet>
        <Searchbar />
      </Card>
    );
  };
}

export default Search;
