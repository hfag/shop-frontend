const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
  "@formatjs/intl-relativetimeformat",
  "@formatjs/intl-utils",
  "react-intl",
  "intl-format-cache",
  "intl-messageformat-parser",
  "intl-messageformat"
]);

module.exports = withPlugins([withTM], {
  env: {
    API_URL: "http://localhost:3000/shop-api"
  }
});
