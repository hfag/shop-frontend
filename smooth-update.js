const fs = require("fs");
const path = require("path");

const ncp = require("ncp");
const rimraf = require("rimraf");

const previous = fs.readdirSync(path.join(__dirname, "dist", "client"));
const current = fs.readdirSync(path.join(__dirname, "dist", "client-build"));
const copied = [];
const deleted = [];

Promise.all(
  current.map(
    file =>
      new Promise((resolve, reject) => {
        ncp(
          path.join(__dirname, "dist", "client-build", file),
          path.join(__dirname, "dist", "client", file),
          { mkdirp: true },
          err => {
            if (err) {
              return reject(err);
            }
            copied.push(file);
            return resolve();
          }
        );
      })
  )
)
  .then(() => {
    return Promise.all(
      previous.map(
        file =>
          new Promise((resolve, reject) => {
            if (copied.indexOf(file) === -1) {
              deleted.push(file);
              rimraf(path.join(__dirname, "dist", "client", file), err => {
                if (err) {
                  return reject(err);
                }

                return resolve();
              });
            }

            return resolve();
          })
      )
    );
  })
  .then(() => {
    console.log(
      "Copied",
      copied.length,
      "files/dirs and deleted",
      deleted.length,
      "files/dirs"
    );
  })
  .catch(err => {
    console.error(err);
  });
