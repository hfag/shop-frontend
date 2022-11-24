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
  REVALIDATION_SECRET: "test",
  ABSOLUTE_URL: "http://127.0.0.1:8080",
  ASSET_URL: "http://127.0.0.1:3000/assets",
  API_URL: "http://127.0.0.1:3000/shop-api",
  ADMIN_API_URL: "http://127.0.0.1:3000/admin-api",
  // ABSOLUTE_URL: "https://shop.feuerschutz.ch",
  // ASSET_URL: "https://shop.feuerschutz.ch/assets",
  // API_URL: "https://shop.feuerschutz.ch/shop-api",
  // ADMIN_API_URL: "https://shop.feuerschutz.ch/admin-api",
  // REVALIDATION_SECRET: "",
  WP_BLOG_URL: "https://api.feuerschutz.ch",
  PUBLIC_PATH: "/",
};

module.exports = withTM(
  withBundleAnalyzer({
    env,
  })
);
