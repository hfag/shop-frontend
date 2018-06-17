//react
import setLocale from "set-yup-locale";
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import createHistory from "history/createBrowserHistory";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import throttle from "lodash/throttle";

import App from "./App";
import reducers from "./reducers";
import { loadState, saveState } from "./local-storage";
import "scss/global.scss";

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
    const { authentication } = store.getState();
    saveState({
      authentication
    });
  }, 1000)
);

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component history={history} store={store} />
    </AppContainer>,
    document.getElementById("root")
  );
};

render(App);
