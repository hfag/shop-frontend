const { env } = require("../next.config");
if (process.argv.length < 3) {
  //eslint-disable-next-line
  throw new Error("Usage: node get-env-variable.js [VARIABLE]");
}
if (!(process.argv[2] in env)) {
  throw new Error(`${process.argv[2]} doesn't exist in ${JSON.stringify(env)}`);
}
//eslint-disable-next-line
console.log(env[process.argv[2]]);
