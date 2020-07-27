const fs = require("fs");
const _path = require("path");
const rimraf = require("rimraf");
const pathnames = require("../utilities/pathnames");

const pages = _path.resolve(__dirname, "..", "pages");
const locales = _path.resolve(__dirname, "..", "locales");
const defaultLanguage = "de";
const languages = ["de", "fr"];

const generatePages = (language, replacements, pathnames) => {
  Object.values(pathnames)
    .filter((p) => p.path)
    .forEach(({ path, languages, pathnames = null }) => {
      const isFile = path.endsWith(".tsx");
      const term = languages[defaultLanguage];
      const rep = [...replacements, [term, languages[language]]];
      // console.log(`rep: ${rep.map((a) => `[${a.join(",")}]`).join(",")}`);

      if (isFile) {
        const src = _path.resolve(pages, path);
        const dst = _path.resolve(
          pages,
          rep.reduce(
            (path, [term, localizedTerm]) => path.replace(term, localizedTerm),
            path
          )
        );
        //   console.log(`Copy ${src} to ${dst}`);

        fs.copyFileSync(src, dst);
      } else {
        const dir = _path.resolve(
          pages,
          rep.reduce(
            (path, [term, localizedTerm]) => path.replace(term, localizedTerm),
            path
          )
        );
        //   console.log(`Create ${dir}`);
        fs.mkdirSync(dir);

        if (pathnames) {
          generatePages(language, rep, pathnames);
        }
      }
    });
};

fs.writeFileSync(
  _path.resolve(pages, defaultLanguage, "config.json"),
  JSON.stringify({
    locale: defaultLanguage,
    messages: JSON.parse(
      fs.readFileSync(_path.resolve(locales, `${defaultLanguage}.json`))
    ),
  })
);

languages
  .filter((l) => l !== defaultLanguage)
  .forEach((lang) => {
    rimraf.sync(_path.resolve(pages, lang));
    fs.mkdirSync(_path.resolve(pages, lang));
    fs.writeFileSync(
      _path.resolve(pages, lang, "config.json"),
      JSON.stringify({
        locale: lang,
        messages: JSON.parse(
          fs.readFileSync(_path.resolve(locales, `${lang}.json`))
        ),
      })
    );
    generatePages(lang, [[defaultLanguage, lang]], pathnames);
  });
