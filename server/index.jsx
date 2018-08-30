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
import { Helmet } from "react-helmet";

import "../src/set-yup-locale";
import App from "./App";
import routes from "./routes";
import reducers from "../src/reducers";

//polyfills
require("isomorphic-fetch");

const PORT = process.env.PORT;

//and the redux store
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

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
  const sheet = new ServerStyleSheet();
  const context = {};

  const promises = matchRoutes(routes, request.url).map(
    ({ route, match }) =>
      route.fetchData && route.shouldFetch(store)
        ? route.fetchData(store)
        : Promise.resolve()
  );

  Promise.all(promises)
    .then(() => {
      const reactDom = renderToString(
        <StyleSheetManager sheet={sheet.instance}>
          <App location={request.url} context={context} store={store} />
        </StyleSheetManager>
      );

      const styleTags = sheet.getStyleTags();

      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(
        indexHtml
          .replace('<div id="root"></div>', `<div id="root">${reactDom}</div>`)
          .replace(
            "</head>",
            `${styleTags}<script>window.__INITIAL_DATA__ = ${JSON.stringify(
              store.getState()
            )}</script>${Helmet.renderStatic()}</head>`
          )
      );
    })
    .catch(e => {
      response.end(e.toString());
    });
};

app.get("/", renderApplication);
app.use(express.static("./dist/client"));
app.get("/*", renderApplication);

app.listen(PORT);

console.log("Server listening on http://localhost:" + PORT);
