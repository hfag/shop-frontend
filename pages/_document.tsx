import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import React from "react";
import createCache from "@emotion/cache";
import createEmotionServer from "create-emotion-server";

interface IProps {
  locale: string;
}

export default class MyDocument extends Document<IProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const cache = createCache();
    const { extractCritical } = createEmotionServer(cache);

    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            data-emotion-css={styles.ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: styles.css }}
          />
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <div id="modal" />
          <div id="lightbox" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
