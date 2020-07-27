import App from "next/app";
import { CacheProvider } from "@emotion/core";
import createCache from "@emotion/cache";

const cache = createCache();

//styles
import "../styles/global.scss";
//analytics script
import "../utilities/analytics";
import "../utilities/set-yup-locale";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <CacheProvider value={cache}>
        <Component {...pageProps} />
      </CacheProvider>
    );
  }
}
