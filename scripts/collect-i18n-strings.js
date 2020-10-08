const fs = require("fs");

const { sync: globSync } = require("glob");
const { sync: mkdirpSync } = require("mkdirp");

const filePattern = "./messages/**/*.json";
const outputDir = "./locales/";

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
let defaultMessages = globSync(filePattern)
  .map((filename) => fs.readFileSync(filename, "utf8"))
  .map((file) => JSON.parse(file))
  .reduce(
    (collection, descriptors) =>
      Object.assign(
        collection,
        Object.keys(descriptors).reduce((obj, key) => {
          obj[key] = descriptors[key].defaultMessage;
          return obj;
        }, {})
      ),
    {}
  );

//order keys
const orderedMessages = {};
Object.keys(defaultMessages)
  .sort()
  .forEach((key) => {
    orderedMessages[key] = defaultMessages[key];
  });

// Create a new directory that we want to write the aggregate messages to
mkdirpSync(outputDir);

// Write the messages to this directory
fs.writeFileSync(
  outputDir + "de.json",
  JSON.stringify({ de: orderedMessages }, null, 2)
);
