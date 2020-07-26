const fs = require("fs");

const { sync: mkdirpSync } = require("mkdirp");

const outputDir = "./locales/";

const messages = JSON.parse(fs.readFileSync("./messages.json", "utf8"));

// Create a new directory that we want to write the aggregate messages to
mkdirpSync(outputDir);

// Write the messages to this directory
fs.writeFileSync(
  outputDir + "de.json",
  `{ "de": ${JSON.stringify(messages, null, 2)} }`
);
