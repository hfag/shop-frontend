import React from "react";
import { Provider } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { hot } from "react-hot-loader";
import { Switch } from "react-router";

import Frontpage from "./containers/Frontpage";
import ProductCategories from "./containers/ProductCategories";
import Product from "./containers/Product";
import Account from "./containers/Account";
import Cart from "./containers/Cart";
import Login from "./containers/Login";
import Logout from "./containers/Logout";
import Wrapper from "./components/Wrapper";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./containers/Search";
import Page404 from "./containers/404";


/**
 * The app's root component
 * @returns {Component} The component
 */
const App = ({ history, store }) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Wrapper>
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
