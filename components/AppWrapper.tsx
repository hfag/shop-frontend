//dependencies
import { IntlProvider } from "react-intl";
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { CurrentUser, Customer } from "../schema";
import useSWR from "swr";
import { useLocalStorage } from "../utilities/hooks";
import { GET_CURRENT_USER } from "../gql/user";
import request from "../utilities/request";
import { Language } from "../utilities/i18n";

export const AppContext = React.createContext<{
  burgerMenuOpen: boolean;
  toggleBurgerMenu: () => void;
  user: CurrentUser | null;
  customer: Customer | null;
  token: string | null;
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

  const { data, error } = useSWR<{ activeCustomer: Customer; me: CurrentUser }>(
    token ? [GET_CURRENT_USER, token] : null,
    (query) =>
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
