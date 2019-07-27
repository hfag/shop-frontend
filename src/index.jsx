/* polyfills */
import "@babel/polyfill";
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
import { addLocaleData } from "react-intl";
import localeDe from "react-intl/locale-data/de";
import localeFr from "react-intl/locale-data/fr";

import "./set-yup-locale";
import App from "./App";
import { createRootReducer } from "./reducers";
import { loadState, saveState } from "./local-storage";
import "./scss/global.scss";
import "./utilities/analytics";
import { trackPageView } from "./utilities/analytics";

//Set languages
addLocaleData([...localeDe, ...localeFr]);

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
      store => next => action => {
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

const render = Component => {
  ReactDOM.hydrate(
    <Component history={history} store={store} />,
    document.getElementById("root")
  );
};

render(App);
