import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import Header from "containers/Header";
import Breadcrumbs from "containers/Breadcrumbs";
import Footer from "components/Footer";

/**
 * The global wrapper component
 * @returns {Component} The component
 */
class Wrapper extends React.Component {
  render = () => {
    const { children } = this.props;
    //"outer-container" and "page-wrap" are used by "react-burger-menu"
    return (
      <ThemeProvider
        theme={{
          breakpoints: ["36rem", "48rem", "62rem", "75rem"]
        }}
      >
        <div id="outer-container">
          <Header />
          <main id="page-wrap">
            <Breadcrumbs />
            {children}
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    );
  };
}

Wrapper.propTypes = {
  children: PropTypes.node
};

export default Wrapper;
