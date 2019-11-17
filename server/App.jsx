import React from "react";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { renderRoutes } from "react-router-config";
import { IntlProvider } from "react-intl";

import Wrapper from "../src/components/Wrapper";
import routes from "./routes";
import { getLanguageFromPathname } from "../src/utilities/i18n";
import messagesDe from "../src/locales/de.json";
import messagesFr from "../src/locales/fr.json";

const MESSAGES = {
  ...messagesDe,
  ...messagesFr
};

/**
 * The app's root component
 * @returns {Component} The component
 */
const App = ({ location, language, context, store }) => {
  return (
    <Provider store={store}>
      <IntlProvider locale={language} messages={MESSAGES[language]}>
        <StaticRouter location={location} context={context}>
          <Wrapper>{renderRoutes(routes)}</Wrapper>
        </StaticRouter>
      </IntlProvider>
    </Provider>
  );
};

export default App;
