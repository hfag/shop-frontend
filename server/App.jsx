import React from "react";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { renderRoutes } from "react-router-config";

import Wrapper from "../src/components/Wrapper";
import routes from "./routes";

/**
 * The app's root component
 * @returns {Component} The component
 */
const App = ({ location, context, store }) => {
  return (
    <Provider store={store}>
      <StaticRouter location={location} context={context}>
        <Wrapper>{renderRoutes(routes)}</Wrapper>
      </StaticRouter>
    </Provider>
  );
};

export default App;
