import App from "next/app";

//styles
import "../styles/global.scss";
//analytics script
import "../utilities/analytics";
import "../utilities/set-yup-locale";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}
