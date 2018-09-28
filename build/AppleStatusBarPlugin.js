/**
 * Creates an html webpack plugin
 */
class AppleStatusBarStyleWebpackPlugin {
  constructor(style = "black") {
    this.style = style;
  }

  /**
   * Applies the plugin
   * @param {Object} compiler The webpack compiler
   * @returns {void}
   */
  apply(compiler) {
    if (compiler.hooks) {
      // webpack 4 support
      compiler.hooks.compilation.tap(
        "AppleStatusBarStyleWebpackPlugin",
        compilation => {
          compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
            "FaviconsWebpackPostProcessPlugin",
            this.changeAppleStatusBarStyleMeta.bind(this)
          );
        }
      );
      return;
    }

    // Webpack 3 and below
    compiler.plugin("compilation", compilation => {
      compilation.plugin(
        "html-webpack-plugin-after-html-processing",
        this.changeAppleStatusBarStyleMeta.bind(this)
      );
    });
  }

  /**
   * Updates the status bar style
   * @param {Object} data The data object
   * @param {function} callback The callback function
   * @returns {void}
   */
  changeAppleStatusBarStyleMeta(data, callback) {
    const html = data.html.replace(
      '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
      `<meta name="apple-mobile-web-app-status-bar-style" content="${
        this.style
      }">`
    );
    callback(null, Object.assign({}, data, { html }));
  }
}

module.exports = AppleStatusBarStyleWebpackPlugin;
