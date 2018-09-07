import path from "path";
import fs from "fs";

import express from "express";
import compression from "compression";
import helmet from "helmet";
import React from "react";
import { renderToString } from "react-dom/server";
import { matchRoutes } from "react-router-config";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { Helmet as ReactHelmet } from "react-helmet";

import "../src/set-yup-locale";
import { setIn } from "formik";

import App from "./App";
import routes from "./routes";
import reducers from "../src/reducers";

//polyfills
require("isomorphic-fetch");

const PORT = process.env.SERVER_PORT;

const indexHtml = fs.readFileSync("./dist/client/index.html").toString();

const app = express();

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
  const store = createStore(reducers, applyMiddleware(thunkMiddleware));
  const sheet = new ServerStyleSheet();
  const context = {};

  const matchedRoutes = matchRoutes(routes, request.url);
  const promises = matchedRoutes.map(
    ({ route, match }) =>
      route.fetchData ? route.fetchData(store, route, match) : Promise.resolve()
  );

  Promise.all(promises)
    .then(() => {
      //Update state

      const reactDom = renderToString(
        <StyleSheetManager sheet={sheet.instance}>
          <App location={request.url} context={context} store={store} />
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
              store.getState()
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
    });
};

app.get("/", renderApplication);
app.use(express.static("./dist/client"));
app.get("/*", renderApplication);

app.listen(PORT);

console.log("Server listening on http://localhost:" + PORT) + "!";
/*setInterval(() => {
  console.log("Checking cache...");
  const now = Date.now();
  const idsToRemove = Object.values(state.products.byId)
    .filter(product => now - product._lastFetched < 1000 * 60 * 60 * 4)
    .map(product => {
      delete state.product.byId[product.id];
      return product.id;
    });
  state.products.allIds = state.products.allIds.filter(
    id => !idsToRemove.includes(id)
  );
  console.log("Removed " + idsToRemove.length + " products from cache!");

  console.log("Done!");
}, 1000 * 60 * 30);
console.log("Cache clearing deamon initialized!");
*/
