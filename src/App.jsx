import React from "react";
import { Provider } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { hot } from "react-hot-loader/root";
import { Switch, Redirect } from "react-router";
import { IntlProvider } from "react-intl";

import { universalWithLoadingBar } from "./utilities/universal";
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
import { isLanguageSupported, getLanguageFromLocation } from "./utilities/i18n";
import { pathnamesByLanguage } from "./utilities/urls";

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
  de: messagesDe,
  fr: messagesFr
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
  location: { pathname, search }
}) => {
  if (!isLanguageSupported(lang)) {
    return <Redirect to={`/de${pathname}${search}`} />;
  }

  const pathnames = pathnamesByLanguage[lang];

  return (
    <Switch>
      <Route exact path={`/${lang}/`} component={Frontpage} />
      <Route
        path={`/${lang}/${pathnames.productCategory}`}
        component={ProductCategories}
      />
      <Route exact path={`/${lang}/${pathnames.search}`} component={Search} />
      <Route
        exact
        path={`/${lang}/${pathnames.product}/:productSlug`}
        component={Product}
      />
      <Route
        exact
        path={`/${lang}/${pathnames.post}/:postSlug`}
        component={Post}
      />
      <Route
        exact
        path={`/${lang}/${pathnames.page}/:pageSlug`}
        component={Page}
      />
      <Route exact path={`/${lang}/${pathnames.login}`} component={Login} />
      <Route exact path={`/${lang}/${pathnames.logout}`} component={Logout} />
      <Route path={`/${lang}/${pathnames.account}`} component={Account} />
      <Route exact path={`/${lang}/${pathnames.cart}`} component={Cart} />
      <Route
        exact
        path={`/${lang}/${pathnames.confirmation}`}
        component={Confirmation}
      />
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
      <IntlProvider locale={lang} messages={MESSAGES[lang]} defaultLocale="de">
        <ConnectedRouter history={history}>
          <Wrapper>
            <Switch>
              <Route path="/:lang/" component={Routes} />
              <Redirect to={`/de/${window.location.search}`} />
            </Switch>
          </Wrapper>
        </ConnectedRouter>
      </IntlProvider>
    </Provider>
  );
};

export default hot(App);
