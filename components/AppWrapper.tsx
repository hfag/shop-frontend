import { useIntl, IntlProvider } from "react-intl";
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { Customer } from "../schema";
import useSWR from "swr";
import { useLocalStorage } from "../utilities/hooks";
import { GET_CURRENT_CUSTOMER } from "../gql/user";
import request from "../utilities/request";
import { writeHeapSnapshot } from "v8";

export const AppContext = React.createContext<{
  burgerMenuOpen: boolean;
  toggleBurgerMenu: () => void;
  user: Customer | null;
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

  const { data, error } = useSWR<{ activeCustomer: Customer }>(
    token ? [GET_CURRENT_CUSTOMER, token] : null,
    (query) => request(intl.locale, query)
  );

  return (
    <AppContext.Provider
      value={{
        burgerMenuOpen,
        toggleBurgerMenu,
        user: token && data ? data.activeCustomer : null,
        token,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppWrapper;

export const withApp = (
  locale: string,
  messages: { [key: string]: string }
) => (Component: React.ElementType) => (props) => {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <AppWrapper>
        <Component {...props} />
      </AppWrapper>
    </IntlProvider>
  );
};
