const fs = require("fs");
const path = require("path");

const PATTERN = /implements ([A-z]*,\s*[A-z]*)+/g;
const FILE = path.resolve(__dirname, "..", "schema.graphql");

const schema = fs.readFileSync(FILE, "utf-8");

fs.writeFileSync(
  FILE,
  schema.replace(PATTERN, (match) => match.replace(/\s*,\s*/, " & "))
);
