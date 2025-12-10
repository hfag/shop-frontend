const express = require("express");
const next = require("next");
const { parse } = require("url");

const DEFAULT_LANGUAGE = "de";
const SUPPORTED_LANGUAGES = ["de", "fr"];

const getLanguageFromPathname = (pathname, fallback = DEFAULT_LANGUAGE) => {
  const locale = pathname.split("/")[1];

  return SUPPORTED_LANGUAGES.includes(locale) ? locale : fallback;
};

const hostname = process.env.HOSTNAME;
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ hostname, port, dev });
const handle = app.getRequestHandler();

// A custom server as described at https://nextjs.org/docs/pages/guides/custom-server
app
  .prepare()
  .then(() => {
    const server = express();
    server.all("*route", (request, response) => {
      //add locale for pages but no static assets
      if (
        !request.url.startsWith("/_next/") && //next js stuff
        !request.url.startsWith("/api") && // global urls
        request.url.indexOf(".") === -1 //static files from public folder
      ) {
        let locale = getLanguageFromPathname(request.url, "no-language");
        if (locale === "no-language") {
          //if the requested path doesn't contain a language, redirect
          response.redirect(
            `/${DEFAULT_LANGUAGE}${request.url === "/" ? "" : request.url}`
          );
          return;
        } else if (request.url.endsWith("/")) {
          response.redirect(request.url.substring(0, request.url.length - 1));
          return;
        }

        request.locale = locale;
      }

      const parsedUrl = parse(request.url, true);
      handle(request, response, parsedUrl);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      //eslint-disable-next-line
      console.log(
        `> Ready on http://${hostname}:${port} - env ${process.env.NODE_ENV}`
      );
    });
  })
  .catch(console.error);
