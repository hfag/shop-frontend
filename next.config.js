const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
  "@formatjs/intl-relativetimeformat",
  "@formatjs/intl-utils",
  "react-intl",
  "intl-format-cache",
  "intl-messageformat-parser",
  "intl-messageformat",
]);
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const env = {
  ABSOLUTE_URL: "http://localhost:8080",
  ASSET_URL: "http://localhost:3000/assets",
  API_URL: "http://localhost:3000/shop-api",
  ADMIN_API_URL: "http://localhost:3000/admin-api",
  ASSET_URL: "http://localhost:3000/assets",
  // ABSOLUTE_URL: "https://beta.feuerschutz.ch",
  // ASSET_URL: "https://beta.feuerschutz.ch/assets",
  // API_URL: "https://beta.feuerschutz.ch/shop-api",
  // ADMIN_API_URL: "https://beta.feuerschutz.ch/admin-api",
  WP_BLOG_URL: "https://api.feuerschutz.ch",
  PUBLIC_PATH: "/",
};

module.exports = withPlugins([withTM, withBundleAnalyzer({})], {
  env,
});

module.exports.env = env;
