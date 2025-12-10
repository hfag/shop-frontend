import { CurrentUser, Customer, Maybe } from "../schema";
import React from "react";

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
