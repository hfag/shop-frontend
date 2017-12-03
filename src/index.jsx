//react
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

//routing
import createHistory from "history/createBrowserHistory";

//redux
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";

//reducers
import reducers from "./reducers";

//general
import throttle from "lodash/throttle";
import { loadState, saveState } from "./local-storage";

//components
import App from "App";

//styles
import "scss/global.scss";

//polyfills
require("es6-promise").polyfill();
require("isomorphic-fetch");

//Load state from local storage and create history object
const presistedState = loadState();
const history = createHistory();

//and the redux store
const store = createStore(
	reducers,
	presistedState,
	composeWithDevTools(
		applyMiddleware(thunkMiddleware, routerMiddleware(history))
	)
);

//storing *some* keys of the application state in the localstorage
store.subscribe(
	throttle(() => {
		const { routing } = store.getState();
		saveState({
			routing
		});
	}, 1000)
);

const render = Component => {
	ReactDOM.render(
		<AppContainer>
			<App history={history} store={store} />
		</AppContainer>,
		document.getElementById("root")
	);
};

//do the initial render
render(App);

if (module.hot) {
	module.hot.accept("App", () => {
		render(App);
	});
}
