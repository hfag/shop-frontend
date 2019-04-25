import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { hot } from "react-hot-loader";
import { Switch, Redirect } from "react-router";
import { IntlProvider } from "react-intl";

import { universalWithLoadingBar } from "./utilities/universal";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker";
import Frontpage from "./containers/Frontpage";
import ProductCategories from "./containers/ProductCategories";
import Logout from "./containers/Logout";
import Wrapper from "./components/Wrapper";
import Page404 from "./containers/404";
import Confirmation from "./containers/Confirmation";
import Post from "./containers/Post";
import Page from "./containers/Page";
import messagesDe from "./locales/de.json";
import messagesFr from "./locales/fr.json";
import {
  getLanguageFromCurrentWindow,
  isLanguageSupported,
  getLanguageFromLocation
} from "./utilities/i18n";
import { getLanguage } from "./reducers";

const Product = universalWithLoadingBar(props =>
  import(/* webpackChunkName: "product" */ "./containers/Product")
);
const Login = universalWithLoadingBar(props =>
  import(/* webpackChunkName: "login" */ "./containers/Login")
);
const Account = universalWithLoadingBar(props =>
  import(/* webpackChunkName: "account" */ "./containers/Account")
);
const Cart = universalWithLoadingBar(props =>
  import(/* webpackChunkName: "cart" */ "./containers/Cart")
);
const Search = universalWithLoadingBar(props =>
  import(/* webpackChunkName: "search" */ "./containers/Search")
);

const MESSAGES = {
  ...messagesDe,
  ...messagesFr
};

/**
 * Handles the routing for all languages
 * @param {Object} props The component props
 * @returns {Component} The route switch
 */
const Routes = ({
  match: {
    params: { lang }
  },
  location: { pathname }
}) => {
  if (!isLanguageSupported(lang)) {
    return (
      <Redirect
        to={
          "/de/" +
          pathname
            .split("/")
            .slice(1)
            .join("/")
        }
      />
    );
  }

  return (
    <Switch>
      <Route exact path={`/${lang}/`} component={Frontpage} />
      <Route
        path={`/${lang}/produkt-kategorie`}
        component={ProductCategories}
      />
      <Route exact path={`/${lang}/suche`} component={Search} />
      <Route exact path={`/${lang}/produkt/:productSlug`} component={Product} />
      <Route exact path={`/${lang}/beitrag/:postSlug`} component={Post} />
      <Route exact path={`/${lang}/seite/:pageSlug`} component={Page} />
      <Route exact path={`/${lang}/login`} component={Login} />
      <Route exact path={`/${lang}/logout`} component={Logout} />
      <Route path={`/${lang}/konto`} component={Account} />
      <Route exact path={`/${lang}/warenkorb`} component={Cart} />
      <Route exact path={`/${lang}/bestaetigung`} component={Confirmation} />
      <Route component={Page404} />
    </Switch>
  );
};

/**
 * The app's root component
 * @returns {Component} The component
 */
const App = ({ history, store }) => {
  const lang = getLanguageFromLocation(history.location);

  return (
    <Provider store={store}>
      <IntlProvider locale={lang} messages={MESSAGES[lang]}>
        <ConnectedRouter history={history}>
          <Wrapper>
            <GoogleAnalyticsTracker />
            <Switch>
              <Route path="/:lang/" component={Routes} />
              <Redirect to="/de/" />
            </Switch>
          </Wrapper>
        </ConnectedRouter>
      </IntlProvider>
    </Provider>
  );
};

export default hot(module)(App);
