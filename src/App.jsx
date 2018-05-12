import React from "react";
import { Provider } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";

import Frontpage from "./containers/Frontpage";
import ProductCategories from "./containers/ProductCategories";
import Product from "./containers/Product";
import Account from "./containers/Account";
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
					<Route
						exact
						path="/category/:categoryId/:page"
						component={ProductCategories}
					/>
					<Route exact path="/product/:productId" component={Product} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/account" component={Account} />
				</Wrapper>
			</ConnectedRouter>
		</Provider>
	);
};

export default App;
