import Document, {
  Main,
  NextScript,
  Html,
  Head,
  DocumentContext,
} from "next/document";
import createEmotionServer from "create-emotion-server";
import createCache from "@emotion/cache";

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
