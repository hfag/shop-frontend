import Document, {
  Main,
  NextScript,
  Html,
  Head,
  DocumentContext,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

interface IProps {
  locale: string;
  localeDataScript: string;
}

export default class MyDocument extends Document<IProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    const initialProps = await super.getInitialProps(ctx);

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

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

  render() {
    // Polyfill Intl API for older browsers
    //const polyfill = `https://cdn.polyfill.io/v3/polyfill.min.js?features=Intl.~locale.${this.props.locale}`;

    return (
      <Html>
        <Head />
        <body>
          <Main />
          {/*<script src={polyfill} />*/}
          <NextScript />
        </body>
      </Html>
    );
  }
}
