const exec = require("child_process").exec;

const puts = (error, stdout, stderr) => console.log(stdout);

const defaultOptions = {
  onBuildStart: [],
  onBuildEnd: []
};

/**
 * Executes a shell script before or after the build
 * @returns {Object} The webpack plugin
 */
class WebpackShellPlugin {
  constructor(options) {
    this.options = Object.assign(defaultOptions, options);
    this.apply = this.apply.bind(this);
  }

  /**
   * Applies the plugin
   * @param {Object} compiler The webpack compiler object
   * @returns {void}
   */
  apply(compiler) {
    const options = this.options;

    if (compiler.hooks) {
      // webpack 4 support
      compiler.hooks.entryOption.tap("WebpackShellPluginBeforeBuild", () => {
        console.log("Executing pre-build scripts");
        options.onBuildStart.forEach(script => exec(script, puts));
      });
      compiler.hooks.afterEmit.tapAsync("WebpackShellPluginAfterBuild", () => {
        console.log("Executing post-build scripts");
        options.onBuildEnd.forEach(script => exec(script, puts));
      });
      return;
    }

    compiler.plugin("compilation", compilation => {
      if (options.onBuildStart.length) {
        console.log("Executing pre-build scripts");
        options.onBuildStart.forEach(script => exec(script, puts));
      }
    });

    compiler.plugin("emit", (compilation, callback) => {
      if (options.onBuildEnd.length) {
        console.log("Executing post-build scripts");
        options.onBuildEnd.forEach(script => exec(script, puts));
      }
      callback();
    });
  }
}

module.exports = WebpackShellPlugin;
