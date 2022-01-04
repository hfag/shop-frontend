//styles
import "../styles/global.scss";
//analytics script
//import "../utilities/analytics";
import "../utilities/set-yup-locale";

//dependencies
import App from "next/app";
import React from "react";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}
