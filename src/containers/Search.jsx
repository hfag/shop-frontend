import React from "react";

import Card from "../components/Card";
import Searchbar from "./Searchbar";

/**
 * The search page
 * @returns {Component} The component
 */
class Search extends React.PureComponent {
  constructor() {
    super();
    this.state = { registered: false };
  }
  render = () => {
    return (
      <Card>
        <Searchbar />
      </Card>
    );
  };
}

export default Search;
