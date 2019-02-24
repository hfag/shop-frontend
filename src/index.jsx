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
import { addLocaleData } from "react-intl";
import localeDe from "react-intl/locale-data/de";
import localeFr from "react-intl/locale-data/fr";

import "./set-yup-locale";
import App from "./App";
import reducers from "./reducers";
import { loadState, saveState } from "./local-storage";
import "./scss/global.scss";

//Set languages
addLocaleData([...localeDe, ...localeFr]);

//Load state from local storage and create history object
const presistedState = { ...window.__INITIAL_DATA__, ...loadState() };
const history = createHistory();

history.listen(location => {
  if (window.ga) {
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
      /* show loading animation */
      store => next => action => {
        if (action.visualize === true) {
          store.dispatch(action.isFetching ? showLoading() : hideLoading());
        }
        return next(action);
      },
      /* do google analytics */
      store => next => action => {
        if (action.type.startsWith("TRACK_") && action.payload) {
          window.dataLayer = window.dataLayer || [];
          dataLayer.push({
            event: action.type,
            payload: action.payload
          });
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

/* Begin Google Tag Manager */
if (typeof window !== "undefined") {
  window["dataLayer"] = window["dataLayer"] || [];
  window["dataLayer"].push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js"
  });
  let f = document.getElementsByTagName("script")[0],
    j = document.createElement("script");
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=GTM-M72QNLR";
  f.parentNode.insertBefore(j, f);
}
/* End Google Tag Manager */
