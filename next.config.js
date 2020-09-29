const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
  "@formatjs/intl-relativetimeformat",
  "@formatjs/intl-utils",
  "react-intl",
  "intl-format-cache",
  "intl-messageformat-parser",
  "intl-messageformat",
]);

const env = {
  // ASSET_URL: "http://localhost:3000/assets",
  // API_URL: "http://localhost:3000/shop-api",
  // ADMIN_API_URL: "http://localhost:3000/admin-api",
  ASSET_URL: "https://vendure.feuerschutz.ch/assets",
  API_URL: "https://vendure.feuerschutz.ch/shop-api",
  ADMIN_API_URL: "https://vendure.feuerschutz.ch/admin-api",
  WP_BLOG_URL: "https://api.feuerschutz.ch",
  ABSOLUTE_URL: "",
  PUBLIC_PATH: "/",
};

module.exports = withPlugins([withTM], {
  env,
});

module.exports.env = env;
