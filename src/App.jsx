import React from "react";
import { Provider } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { hot } from "react-hot-loader";
import { Switch } from "react-router";
import { Helmet } from "react-helmet";

import { universalWithLoadingBar } from "./utilities/universal";
import Frontpage from "./containers/Frontpage";
import ProductCategories from "./containers/ProductCategories";
import Logout from "./containers/Logout";
import Wrapper from "./components/Wrapper";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./containers/Search";
import Page404 from "./containers/404";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

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

/**
 * The app's root component
 * @returns {Component} The component
 */
const App = ({ history, store }) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Wrapper>
          <Helmet>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta name="keywords" content="" />
            <meta name="author" content="Nico Hauser" />
            <meta name="format-detection" content="telephone=no" />

            <title>Shop der Hauser Feuerschutz AG</title>
            <meta
              name="description"
              content="Bei der Hauser Feuerschutz AG finden Sie alle Produkte im Bereich Feuerschutz sowie ein kompetenter Kundensupport der Ihnen gerne Ihre Fragen beantwortet."
            />
            <link rel="canonical" href={ABSOLUTE_URL} />
          </Helmet>
          <ScrollToTop>
            <Switch>
              <Route exact path="/" component={Frontpage} />
              <Route path="/produkte" component={ProductCategories} />
              <Route path="/suche" component={Search} />
              <Route exact path="/produkt/:productSlug" component={Product} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              <Route path="/konto" component={Account} />
              <Route exact path="/warenkorb" component={Cart} />
              <Route component={Page404} />
            </Switch>
          </ScrollToTop>
        </Wrapper>
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(module)(App);
