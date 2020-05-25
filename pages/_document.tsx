import Document, {
  Main,
  NextScript,
  Html,
  DocumentContext,
} from "next/document";
import Head from "next/head";
import { ServerStyleSheet } from "styled-components";

interface IProps {
  styleTags: unknown;
}

export default class MyDocument extends Document<IProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      // extract the initial props that may be present.
      const initialProps = await Document.getInitialProps(ctx);

      // Step 4: Pass styleTags as a prop
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
