const fs = require("fs");

const defaultLanguage = "de";
const languages = ["de", "fr"];

const defaultMessages = JSON.parse(
  fs.readFileSync(`./locales/${defaultLanguage}.json`, "utf-8")
);

languages
  .filter((l) => l !== defaultLanguage)
  .forEach((language) => {
    const path = `./locales/${language}.json`;
    const messages = fs.existsSync(path)
      ? JSON.parse(fs.readFileSync(path, "utf-8"))
      : {};
    Object.keys(defaultMessages).forEach((key) => {
      if (!(key in messages) || messages[key].startsWith("TODO:")) {
        messages[key] = `TODO: (${defaultLanguage}) ${defaultMessages[key]}`;
      }
    });

    Object.keys(messages).forEach((key) => {
      if (!(key in defaultMessages)) {
        //key was removed
        delete messages[key];
      }
    });

    //order keys
    const orderedMessages = {};
    Object.keys(messages)
      .sort()
      .forEach((key) => {
        orderedMessages[key] = messages[key];
      });

    fs.writeFileSync(path, JSON.stringify(orderedMessages, null, 2));
  });
