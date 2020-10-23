const fs = require("fs");
const _path = require("path");
const rimraf = require("rimraf");
const pathnames = require("../utilities/pathnames");

const pages = _path.resolve(__dirname, "..", "pages");
const defaultLanguage = "de";
const languages = ["de", "fr"];

const generatePages = (language, replacements, pathnames) => {
  Object.values(pathnames).forEach(({ path, languages, pathnames = null }) => {
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

languages
  .filter((l) => l !== defaultLanguage)
  .forEach((lang) => {
    rimraf.sync(_path.resolve(pages, lang));
    fs.mkdirSync(_path.resolve(pages, lang));
    fs.writeFileSync(
      _path.resolve(pages, lang, "config.ts"),
      `import m from "../../locales/${lang}.json";

export const locale = "${lang}";
export const messages = m;

const Page = () => null;
export default Page;
      `
    );
    generatePages(lang, [[defaultLanguage, lang]], pathnames);
  });
