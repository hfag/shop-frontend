//styles
import "../styles/global.scss";
//analytics script
//import "../utilities/analytics";
import "../utilities/set-yup-locale";

//dependencies
import App from "next/app";
import React from "react";
import { CacheProvider } from "@emotion/core";
import { cache } from "emotion";

interface IProps {}

export default class MyApp extends App<IProps> {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <CacheProvider value={cache}>
        <Component {...pageProps} />
      </CacheProvider>
    );
  }
}
