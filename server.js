const { basename } = require("path");
const { readFileSync } = require("fs");
const express = require("express");
const next = require("next");
const glob = require("glob");
const areIntlLocalesSupported = require("intl-locales-supported").default;

const DEFAULT_LANGUAGE = "de";
const SUPPORTED_LANGUAGES = ["de", "fr"];

const getLanguageFromPathname = (pathname, fallback = DEFAULT_LANGUAGE) => {
  const locale = pathname.split("/")[1];

  return SUPPORTED_LANGUAGES.includes(locale) ? locale : fallback;
};

// Get the supported languages by looking for translations in the `lang/` dir.
const supportedLanguages = glob
  .sync("./locales/*.json")
  .map((f) => basename(f, ".json"));

// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(supportedLanguages)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and patch the constructors we need with the polyfills.
    const IntlPolyfill = require("intl");
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    //@ts-ignore
    Intl.__disableRegExpRestore = IntlPolyfill.__disableRegExpRestore;
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require("intl");
}

// Fix: https://github.com/zeit/next.js/issues/11777
// See related issue: https://github.com/andyearnshaw/Intl.js/issues/308
//@ts-ignore
if (Intl.__disableRegExpRestore) {
  //@ts-ignore
  Intl.__disableRegExpRestore();
}

// Polyfill DOMParser for **pre-v4** react-intl used by formatjs.
// Only needed when using FormattedHTMLMessage. Make sure to install `xmldom`.
// See: https://github.com/zeit/next.js/issues/10533
// const { DOMParser } = require('xmldom')
// global.DOMParser = DOMParser

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map();
const getLocaleDataScript = (locale) => {
  const lang = locale.split("-")[0];
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(
      `@formatjs/intl-relativetimeformat/dist/locale-data/${lang}`
    );
    const localeDataScript = readFileSync(localeDataFile, "utf8");
    localeDataCache.set(lang, localeDataScript);
  }
  return localeDataCache.get(lang);
};

const getMessages = (locale) => {
  return require(`./locales/${locale}.json`);
};

app.prepare().then(() => {
  const server = express();
  server.all("*", (request, response) => {
    // const accept = accepts(request);
    // const locale = accept.language(supportedLanguages) || "de";

    //add locale for pages but no static assets
    if (!request.url.startsWith("/_next/")) {
      let locale = getLanguageFromPathname(request.url, "no-language");
      if (locale === "no-language") {
        //if the requested path doesn't contain a language, redirect
        response.redirect(
          `/${DEFAULT_LANGUAGE}${request.url === "/" ? "" : request.url}`
        );
        return;
      } else if (request.url === `/${locale}/`) {
        response.redirect(`/${locale}$`);
        return;
      }

      // console.log("render with locale", request.url, locale);

      request.locale = locale;
      request.localeDataScript = getLocaleDataScript(locale);
      request.messages = getMessages(locale);
    }

    handle(request, response);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    //eslint-disable-next-line
    console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
  });
});
