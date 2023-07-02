import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

interface IProps {
  locale: string;
}

const getLanguageFromPathname = (pathname: string, fallback: string) => {
  const locale = pathname.split("/")[1];
  return ["de", "fr"].includes(locale) ? locale : fallback;
};

export default class MyDocument extends Document<IProps> {
  render() {
    return (
      <Html lang={getLanguageFromPathname(this.props.__NEXT_DATA__.page, "de")}>
        <Head />
        <body spellCheck="false">
          <Main />
          <div id="modal" />
          <div id="lightbox" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
