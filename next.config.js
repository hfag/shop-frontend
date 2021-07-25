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
  ASSET_URL: "http://localhost:3000/assets",
  API_URL: "http://localhost:3000/shop-api",
  ADMIN_API_URL: "http://localhost:3000/admin-api",
  ASSET_URL: "http://localhost:3000/assets",
  // API_BASE_URL: "https://vendure.feuerschutz.ch",
  // API_URL: "https://vendure.feuerschutz.ch/shop-api",
  // ADMIN_API_URL: "https://vendure.feuerschutz.ch/admin-api",
  // ASSET_URL: "https://vendure.feuerschutz.ch/assets",
  WP_BLOG_URL: "https://api.feuerschutz.ch",
  // ABSOLUTE_URL: "https://beta.feuerschutz.ch",
  ABSOLUTE_URL: "",
  PUBLIC_PATH: "/",
};

module.exports = withPlugins([withTM, withBundleAnalyzer({})], {
  env,
});

module.exports.env = env;
