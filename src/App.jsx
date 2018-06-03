import React from "react";
import { Provider } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { hot } from "react-hot-loader";

import Frontpage from "./containers/Frontpage";
import ProductCategories from "./containers/ProductCategories";
import Product from "./containers/Product";
import Account from "./containers/Account";
import Cart from "./containers/Cart";
import Login from "./components/Login";
import Wrapper from "./components/Wrapper";

/**
 * The app's root component
 * @returns {Component} The component
 */
const App = ({ history, store }) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Wrapper>
          <Route exact path="/" component={Frontpage} />
          <Route path="/produkte" component={ProductCategories} />
          <Route exact path="/produkt/:productSlug" component={Product} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/konto" component={Account} />
          <Route exact path="/warenkorb" component={Cart} />
        </Wrapper>
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(module)(App);
