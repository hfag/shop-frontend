/* polyfills */
import "@babel/polyfill";
import "intersection-observer";
import "isomorphic-fetch";

//react
import React from "react";
import ReactDOM from "react-dom";
import createHistory from "history/createBrowserHistory";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import throttle from "lodash/throttle";

import "./set-yup-locale";
import App from "./App";
import reducers from "./reducers";
import { loadState, saveState } from "./local-storage";
import "./scss/global.scss";

//Load state from local storage and create history object
const presistedState = { ...window.__INITIAL_DATA__, ...loadState() };
const history = createHistory();

history.listen(location => {
  if(window.ga){
  window.ga("set", "page", location.pathname + location.search);
  window.ga("send", "pageview");
  }
});

//and the redux store
const store = createStore(
  reducers,
  presistedState,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(history),
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
