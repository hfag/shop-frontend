import React from "react";
import { Helmet } from "react-helmet";
import queryString from "query-string";

import Card from "../components/Card";
import {
  getProductSearchSections,
  getLastProductSearchQuery
} from "../reducers";
import SkuSelection from "./SkuSelection";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * The search page
 * @returns {Component} The component
 */
class Search extends React.PureComponent {
  render = () => {
    const { query } = queryString.parse(location.search);

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
        <SkuSelection query={query} />
      </Card>
    );
  };
}

export default Search;
