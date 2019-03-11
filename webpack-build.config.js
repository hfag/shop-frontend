const path = require("path");
const ChildProcess = require("child_process");

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const AppleStatusBarPlugin = require("./build/AppleStatusBarPlugin");
const WebpackShellPlugin = require("./build/WebpackShellPlugin");

require("dotenv").config(); //include env file in here as well

process.traceDeprecation = true; //https://github.com/webpack/loader-utils/issues/56

const context = __dirname;

const PUBLIC_PATH = process.env.PUBLIC_PATH;
/*const ROLLBAR_PUBLIC_ACCESS_TOKEN = "ffd21bafd45c4974aa0b8f5c07d6243a";
const ROLLBAR_PRIVATE_ACCESS_TOKEN = process.env.ROLLBAR_PRIVATE_ACCESS_TOKEN;*/
const VERSION = ChildProcess.execSync("git rev-parse HEAD")
  .toString()
  .trim();

module.exports = {
  mode: "production",

  context,

  entry: {
    index: ["@babel/polyfill", path.join(context, "src/index.jsx")]
  },

  devtool: "nosources-source-map",

  output: {
    path: path.join(context, "dist/client-build/"),
    filename: "[name].[chunkhash].js",
    publicPath: PUBLIC_PATH
  },

  optimization: {
    splitChunks: {
      chunks: "all"
    },
    minimize: true,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          parallel: true,
          sourceMap: true,
          output: {
            comments: false
          },
          compress: {
            unsafe: false,
            properties: true,
            keep_fargs: false,
            pure_getters: true,
            collapse_vars: true,
            warnings: false,
            sequences: true,
            dead_code: true,
            drop_debugger: true,
            comparisons: true,
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            hoist_funs: true,
            if_return: true,
            join_vars: true,
            drop_console: false
          }
        },
        exclude: [/\.min\.js$/gi] // skip pre-minified libs
      })
    ]
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true
    }),
    new CleanWebpackPlugin(["dist/client-build/*.*"]),
    new HtmlWebpackPlugin({
      title: "Schilder Portal - Shop der Hauser Feuerschutz AG",
      template: "index.prod.ejs",
      /*accessToken: ROLLBAR_PUBLIC_ACCESS_TOKEN,*/
      version: VERSION
    }),
    new ScriptExtHtmlWebpackPlugin({ defaultAttribute: "defer" }),
    new PreloadWebpackPlugin({ include: "initial" }),
    new webpack.NoEmitOnErrorsPlugin(),
    new Dotenv({
      path: "./.env", // Path to .env file (this is the default)
      safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe),
      systemvars: false
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash].css"
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyWebpackPlugin([
      {
        from: "robots.txt",
        to: "robots.txt",
        toType: "file"
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "img/",
        to: "img/",
        toType: "dir"
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "wp-content/",
        to: "wp-content/",
        toType: "dir"
      }
    ]),
    new FaviconsWebpackPlugin({
      logo: "img/logo/logo-favicon.png",
      persistentCache: true,
      background: "#fff",
      title: "Feuerschutz"
    }),
    new AppleStatusBarPlugin("black"),
    new WebpackShellPlugin({
      onBuildStart: [],
      onBuildEnd: [
        "cd dist/client-build/icons-* && sed -i '' -e 's/standalone/browser/g' manifest.json",
        "cd dist/client-build/icons-* && sed -i '' -e 's/en-US/de-CH/g' manifest.json",
        "sleep 5 && node ./smooth-update.js"
      ]
    })
  ],

  resolve: {
    modules: [path.resolve(context, "src"), "node_modules"],
    extensions: [".js", ".jsx"],
    alias: {
      img: path.resolve(context, "img")
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(context, "src"),
          path.resolve(context, "node_modules")
        ],

        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      browsers: ["> 0.25%", "last 2 major versions", "IE 11"]
                    },
                    // for uglifyjs...
                    forceAllTransforms: true
                    /*useBuiltIns: "entry"*/
                  }
                ],
                "@babel/preset-react"
              ],
              plugins: [
                "babel-plugin-styled-components",
                ["@babel/plugin-proposal-class-properties", { loose: false }],
                "@babel/plugin-proposal-object-rest-spread",
                "syntax-dynamic-import",
                "universal-import"
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(context, "src"),
          path.resolve(context, "node_modules")
        ],

        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { import: false, sourceMap: true, minimize: true }
          },
          { loader: "postcss-loader", options: { sourceMap: true } }
        ]
      },
      {
        test: /\.scss$/,
        include: [
          path.resolve(context, "src"),
          path.resolve(context, "node_modules")
        ],

        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { import: false, sourceMap: true, minimize: true }
          },
          { loader: "postcss-loader", options: { sourceMap: true } },
          "resolve-url-loader",
          { loader: "sass-loader", options: { sourceMap: true } }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|svg)$/,
        loader: "file-loader"
      }
    ]
  }
};
