import path from "path";
import fs from "fs";
import url from "url";

import rp from "request-promise";
import sizeOf from "object-sizeof";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import React from "react";
import { renderToString } from "react-dom/server";
import { matchRoutes } from "react-router-config";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { Helmet as ReactHelmet } from "react-helmet";
import { createMemoryHistory } from "history";

import "../src/set-yup-locale";

import App from "./App";
import routes from "./routes";
import {
  createRootReducer,
  getProducts,
  getProductAttributes,
  getAttachments,
  getProductCategories,
  getSales
} from "../src/reducers";
import {
  supportedLanguages,
  getLanguageFromPathname,
  DEFAULT_LANGUAGE,
  languageToFetchString
} from "../src/utilities/i18n";
import { API_URL } from "../src/utilities/api";

//polyfills
require("isomorphic-fetch");

const PORT = process.env.SERVER_PORT;
const DELETE_INTERVAL_IN_MINUTES = 17;

const indexHtml = fs.readFileSync("./dist/client/index.html").toString();

const app = express();

/**
 * Creates a new store
 * @param {Object} history The history object
 * @param {Object} initialState initial state values
 * @returns {Object} The new store
 */
const createNewStore = (history, initialState = {}) =>
  createStore(
    createRootReducer(history),
    initialState,
    applyMiddleware(thunkMiddleware, routerMiddleware(history))
  );
/**
 * Removes the location data from the state
 * @param {Object} state The state to remove the location from
 * @returns {Object} The same state (by reference)
 */
const removeLocation = state => {
  delete state.router;
  return state;
};

const storeByLanguage = supportedLanguages.reduce((object, languageKey) => {
  const history = createMemoryHistory({
    initialEntries: [`/${languageKey}/`]
  });
  object[languageKey] = createNewStore(history);

  return object;
}, {});

app.use(helmet.dnsPrefetchControl());
app.use(helmet.ieNoOpen());
app.use(helmet.noCache());
app.disable("X-Powered-By");
app.use(compression());

/**
 * Renders the jsx for the given request
 * @param {Request} request The express request object
 * @param {Response} response The express response object
 * @returns {void}
 */
const renderApplication = (request, response) => {
  const sheet = new ServerStyleSheet();
  const context = {};
  let url = request.url;

  //decide on a language / store
  let language = getLanguageFromPathname(url, "no-language");
  if (language === "no-language") {
    //if the requested path doesn't contain a language, treat it as if the default would be preprended
    url = `/${DEFAULT_LANGUAGE}${url}`;
    language = DEFAULT_LANGUAGE;
  }
  const store = storeByLanguage[language];
  const languageFetchString = languageToFetchString(language);

  const matchedRoutes = matchRoutes(routes, url.split("?")[0]);
  const history = createMemoryHistory({
    initialEntries: [url]
  });
  const promises = matchedRoutes.map(({ route, match }) =>
    route.fetchData
      ? route.fetchData(store, route, match, languageFetchString)
      : Promise.resolve()
  );

  Promise.all(promises)
    .then(() => {
      //Update state, now copy the store and dispatch a navigation
      const clonedStore = createNewStore(
        history,
        removeLocation(store.getState())
      );

      const reactDom = renderToString(
        <StyleSheetManager sheet={sheet.instance}>
          <App
            location={url}
            language={language}
            context={context}
            store={clonedStore}
          />
        </StyleSheetManager>
      );

      const styleTags = sheet.getStyleTags();
      const reactHelmet = ReactHelmet.renderStatic();

      response.writeHead(200, { "Content-Type": "text/html" });

      response.end(
        indexHtml
          .replace('<div id="root"></div>', `<div id="root">${reactDom}</div>`)
          .replace(
            "<head>",
            `<head>
            ${["meta", "base", "link", "script", "style", "title"]
              .map(key => reactHelmet[key].toString())
              .join(
                ""
              )}${styleTags}<script>window.__INITIAL_DATA__ = ${JSON.stringify(
              clonedStore.getState()
            )}</script>`
          )
          .replace("<html>", `<html ${reactHelmet.htmlAttributes.toString()}>`)
          .replace(
            "<body>",
            `<body ${reactHelmet.bodyAttributes.toString()}>${reactHelmet.noscript.toString()}`
          )
      );
    })
    .catch(e => {
      response.end("Es ist ein Fehler aufgetreten!");
      console.log(e);
      console.log(store.getState());
    });
};

app.get("/robots.txt", (request, response) =>
  rp(API_URL + "/robots.txt").then(text => response.end(text))
);

app.get("/sitemap.xml", (request, response) =>
  rp(API_URL + "/sitemap.xml").then(text => response.end(text))
);

app.get("/", (request, response) =>
  response.redirect(
    url.format({
      pathname: "/de/",
      query: request.query
    })
  )
);
app.use(express.static("./dist/client"));
app.get("/*", renderApplication);

app.listen(PORT);

console.log("Server listening on http://localhost:" + PORT) + "!";
setInterval(() => {
  console.log("Checking store cache...");

  Object.keys(storeByLanguage).forEach(languageKey => {
    const store = storeByLanguage[languageKey];
    console.log("Start checking store for language key", languageKey);

    const state = store.getState();
    const lastSize = sizeOf(state);

    const products = getProducts(state),
      now = Date.now();
    const saleProductIds = getSales(state).map(sale => sale.productId);
    const invalidProductSlugs = products
      .filter(
        product =>
          product &&
          now - product._lastFetched > 1000 * 60 * DELETE_INTERVAL_IN_MINUTES &&
          !saleProductIds.includes(product.id)
      )
      .map(product => product.slug);

    store.dispatch({
      type: "DELETE_PRODUCTS",
      isFetching: false,
      itemIds: invalidProductSlugs
    });
    console.log(
      `Deleted ${invalidProductSlugs.length} products from the store.`
    );

    const attributes = getProductAttributes(state);
    const invalidAttributeIds = attributes
      .filter(
        attribute =>
          attribute &&
          now - attribute._lastFetched > 1000 * 60 * DELETE_INTERVAL_IN_MINUTES
      )
      .map(attribute => attribute.id);

    store.dispatch({
      type: "DELETE_ATTRIBUTES",
      isFetching: false,
      itemIds: invalidAttributeIds
    });
    console.log(
      `Deleted ${invalidAttributeIds.length} attributes from the store.`
    );

    const attachments = getAttachments(state);
    const productCategoryThumbnailIds = getProductCategories(state).map(
      category => category.thumbnailId
    );
    const invalidAttachmentIds = attachments
      .filter(
        attachment =>
          attachment &&
          (now - attachment._lastFetched >
            1000 * 60 * DELETE_INTERVAL_IN_MINUTES &&
            !productCategoryThumbnailIds.includes(attachment.id))
      )
      .map(attachment => attachment.id);

    store.dispatch({
      type: "DELETE_ATTACHMENTS",
      isFetching: false,
      itemIds: invalidAttachmentIds
    });
    console.log(
      `Deleted ${invalidAttachmentIds.length} attachments from the store.`
    );

    const posts = getProductAttributes(state);
    const invalidPostSlugs = posts
      .filter(
        post =>
          post &&
          now - post._lastFetched > 1000 * 60 * DELETE_INTERVAL_IN_MINUTES
      )
      .map(post => post.slug);

    store.dispatch({
      type: "DELETE_POSTS",
      isFetching: false,
      itemIds: invalidPostSlugs
    });
    console.log(`Deleted ${invalidPostSlugs.length} posts from the store.`);

    console.log(
      "Done! Store size is now about",
      lastSize - sizeOf(store.getState()),
      " bytes smaller"
    );
  });
}, 1000 * 60 * DELETE_INTERVAL_IN_MINUTES);
console.log("Cache clearing deamon initialized!");
