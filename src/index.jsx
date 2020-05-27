/* polyfills */
import "core-js/stable";
import "intersection-observer";
import "isomorphic-fetch";

//react
import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import throttle from "lodash/throttle";

import "./set-yup-locale";
import App from "./App";
import { createRootReducer } from "./reducers";
import { loadState, saveState } from "./local-storage";
import "./scss/global.scss";
import "./utilities/analytics";

//more polyfills
if (!Intl.PluralRules) {
  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/dist/locale-data/de");
  require("@formatjs/intl-pluralrules/dist/locale-data/fr");
}

if (!Intl.RelativeTimeFormat) {
  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/dist/locale-data/de");
  require("@formatjs/intl-relativetimeformat/dist/locale-data/fr");
}

//Load state from local storage and create history object
const presistedState = { ...window.__INITIAL_DATA__, ...loadState() };

//create a history object
const history = createBrowserHistory();

/*history.listen(location => {
  trackPageView(location.pathname + location.search);
});*/

//and the redux store
const store = createStore(
  createRootReducer(history),
  presistedState,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(history),
      /* show loading animation */
      (store) => (next) => (action) => {
        if (action.visualize === true) {
          store.dispatch(action.isFetching ? showLoading() : hideLoading());
        }
        return next(action);
      }
    )
  )
);

//storing *some* keys of the application state in the localstorage
store.subscribe(
  throttle(() => {
    const { account, isAuthenticated } = store.getState();
    saveState({
      account,
      isAuthenticated
    });
  }, 1000)
);

const render = (Component) => {
  ReactDOM.hydrate(
    <Component history={history} store={store} />,
    document.getElementById("root")
  );
};

render(App);
