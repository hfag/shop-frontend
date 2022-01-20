import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

interface IProps {
  locale: string;
}

export default class MyDocument extends Document<IProps> {
  render() {
    return (
      <Html>
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
