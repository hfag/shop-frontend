//styles
import "../styles/global.scss";
import "../styles/quill-custom.scss";

//fonts
import localFont from "next/font/local";

//dependencies
import App from "next/app";
import React from "react";

const font = localFont({
  src: [
    {
      path: "../public/fonts/694048/de34f32a-1665-4069-8dd9-61abfe04b68f.woff2",
      weight: "300",
    },
    {
      path: "../public/fonts/694054/21f9012d-b72a-422e-84c3-96619ee09ae4.woff2",
      weight: "500",
    },
  ],
  preload: true,
  fallback: ["Helvetica", "Arial", "sans-serif"],
  variable: "--main-font",
  display: "swap",
});

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          html,
          body,
          button,
          input,
          optgroup,
          select,
          textarea {
            font-family: ${font.style.fontFamily};
          }
        `,
          }}
        />
        <Component {...pageProps} />
      </>
    );
  }
}
