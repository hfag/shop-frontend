//dependencies
import { IntlProvider } from "react-intl";
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { CurrentUser, Customer, Maybe, Query } from "../schema";
import useSWR from "swr";
import { useLocalStorage } from "../utilities/hooks";
import { GET_CURRENT_USER } from "../gql/user";
import request from "../utilities/request";
import { Language } from "../utilities/i18n";

export const AppContext = React.createContext<{
  burgerMenuOpen: boolean;
  toggleBurgerMenu: () => void;
  user: Maybe<CurrentUser>;
  customer: Maybe<Customer>;
  token: Maybe<string>;
}>({
  burgerMenuOpen: false,
  toggleBurgerMenu: () => {},
  user: null,
  customer: null,
  token: null,
});

const AppWrapper: FunctionComponent<{
  locale: Language;
  messages: any;
  children: ReactNode;
}> = ({ locale, messages, children }) => {
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const toggleBurgerMenu = useCallback(
    () => setBurgerMenuOpen(!burgerMenuOpen),
    [burgerMenuOpen]
  );

  const [token, setToken] = useLocalStorage("vendure-auth-token");

  const { data, error } = useSWR<{
    activeCustomer: Query["activeCustomer"];
    me: Query["me"];
  }>(token ? [GET_CURRENT_USER, token] : null, (query) =>
    request(locale, query).catch((e: Error) => {
      if (e.message.includes("not currently authorized")) {
        return { activeCustomer: null, me: null };
      }
      throw e;
    })
  );

  return (
    <IntlProvider locale={locale} messages={messages}>
      <AppContext.Provider
        value={{
          burgerMenuOpen,
          toggleBurgerMenu,
          user: token && data ? data.me : null,
          customer: token && data ? data.activeCustomer : null,
          token,
        }}
      >
        {children}
      </AppContext.Provider>
    </IntlProvider>
  );
};

export const withApp = (locale: Language, messages: any) => (
  Component: React.JSXElementConstructor<any>
) =>
  React.memo((props: any) => {
    return (
      <AppWrapper locale={locale} messages={messages}>
        <Component {...props} />
      </AppWrapper>
    );
  });

export default AppWrapper;
