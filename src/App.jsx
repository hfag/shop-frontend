import React from "react";
import { Provider } from "react-redux";

import { Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";

//components
import Wrapper from "components/Wrapper";
import Login from "components/Login";

//containers
import Frontpage from "containers/Frontpage";
import ProductCategories from "containers/Frontpage";
import Account from "containers/Account";

const App = ({ history, store }) => {
	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Wrapper>
					<Route exact path="/" component={Frontpage} />
					<Route path="/category/:categoryId" component={ProductCategories} />
					<Route path="/login" component={Login} />
					<Route path="/account" component={Account} />
				</Wrapper>
			</ConnectedRouter>
		</Provider>
	);
};

export default App;
