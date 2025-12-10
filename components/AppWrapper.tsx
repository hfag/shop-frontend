import { CurrentUser, Customer, Maybe, Query } from "../schema";
import { GET_CURRENT_USER } from "../gql/user";
import { IntlProvider } from "react-intl";
import { Language } from "../utilities/i18n";
import { useLocalStorage } from "../utilities/hooks";
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import YupLocalization from "./form/YupLocalization";
import request from "../utilities/request";
import useSWR, { SWRConfig } from "swr";

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
  messages: IntlProvider["props"]["messages"];
  children: ReactNode;
}> = ({ locale, messages, children }) => {
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const toggleBurgerMenu = useCallback(
    () => setBurgerMenuOpen(!burgerMenuOpen),
    [setBurgerMenuOpen, burgerMenuOpen]
  );

  const [token /*, setToken*/] = useLocalStorage("vendure-auth-token");

  const { data /*, error*/ } = useSWR<{
    activeCustomer: Query["activeCustomer"];
    me: Query["me"];
  }>(
    token ? [GET_CURRENT_USER, token] : null,
    ([query]) =>
      request(locale, query).catch((e: Error) => {
        if (e.message.includes('"code":"FORBIDDEN"')) {
          return { activeCustomer: null, me: null };
        }
        throw e;
      }),
    { revalidateOnFocus: false, refreshInterval: 0 }
  );

  return (
    <IntlProvider locale={locale} messages={messages}>
      <SWRConfig
        value={{
          refreshInterval: 0,
          revalidateOnFocus: false,
        }}
      >
        <AppContext.Provider
          value={{
            burgerMenuOpen,
            toggleBurgerMenu,
            user: (token && data?.me) || null,
            customer: (token && data?.activeCustomer) || null,
            token,
          }}
        >
          <YupLocalization>{children}</YupLocalization>
        </AppContext.Provider>
      </SWRConfig>
    </IntlProvider>
  );
};

export const withApp =
  (locale: Language, messages: IntlProvider["props"]["messages"]) =>
  <P extends Record<string, unknown>>(
    Component: React.JSXElementConstructor<P>
  ) =>
    React.memo((props: P) => {
      return (
        <AppWrapper locale={locale} messages={messages}>
          <Component {...props} />
        </AppWrapper>
      );
    });

export default AppWrapper;
