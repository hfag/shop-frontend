//styles
import "../styles/global.scss";
//analytics script
import "../utilities/analytics";
import "../utilities/set-yup-locale";

//dependencies
import App from "next/app";
import {
  createIntl,
  createIntlCache,
  RawIntlProvider,
  useIntl,
} from "react-intl";
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { CurrentUser } from "../schema";
import useSWR from "swr";
import { useLocalStorage } from "../utilities/hooks";
import { GET_CURRENT_CUSTOMER } from "../gql/user";
import request from "../utilities/request";

export const AppContext = React.createContext<{
  burgerMenuOpen: boolean;
  toggleBurgerMenu: () => void;
  user: CurrentUser | null;
  token: string | null;
}>({
  burgerMenuOpen: false,
  toggleBurgerMenu: () => {},
  user: null,
  token: null,
});

const AppWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const intl = useIntl();
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const toggleBurgerMenu = useCallback(
    () => setBurgerMenuOpen(!burgerMenuOpen),
    [burgerMenuOpen]
  );

  const [token, setToken] = useLocalStorage("vendure-auth-token");

  const { data, error } = useSWR<{ me: CurrentUser }>(
    token ? [GET_CURRENT_CUSTOMER, token] : null,
    (query, token) => request(intl.locale, query)
  );

  return (
    <AppContext.Provider
      value={{
        burgerMenuOpen,
        toggleBurgerMenu,
        user: token && data ? data.me : null,
        token,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

declare global {
  interface Window {
    __NEXT_DATA__: { [key: string]: any };
  }
}

const cache = createIntlCache();

export default class MyApp extends App<{
  locale: string;
  messages: Record<string, string>;
}> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // Get the `locale` and `messages` from the request object on the server.
    // In the browser, use the same values that the server serialized.
    const { req } = ctx;
    const { locale, messages } = req || window.__NEXT_DATA__.props;

    return { pageProps, locale, messages };
  }

  render() {
    const { Component, pageProps, locale, messages } = this.props;

    const intl = createIntl(
      {
        locale: locale || "de",
        messages,
      },
      cache
    );

    return (
      <RawIntlProvider value={intl}>
        <AppWrapper>
          <Component {...pageProps} />
        </AppWrapper>
      </RawIntlProvider>
    );
  }
}
