const fs = require("fs");

const { sync: mkdirpSync } = require("mkdirp");

const outputDir = "./locales/";

const messages = JSON.parse(fs.readFileSync("./messages.json", "utf8"));

// Create a new directory that we want to write the aggregate messages to
mkdirpSync(outputDir);

// Write the messages to this directory
fs.writeFileSync(
  outputDir + "de.json",
  `${JSON.stringify(
    Object.keys(messages)
      .sort()
      .reduce((object, key) => {
        object[key] = messages[key].defaultMessage;
        return object;
      }, {}),
    null,
    2
  )}`
);
