const path = require("path");
const ChildProcess = require("child_process");

const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const VERSION = ChildProcess.execSync("git rev-parse HEAD")
  .toString()
  .trim();

process.traceDeprecation = true; //https://github.com/webpack/loader-utils/issues/56

const context = __dirname;

module.exports = {
  mode: "development",

  context,

  entry: ["react-hot-loader/patch", path.join(context, "src/index.jsx")],

  output: {
    path: path.join(context, "dist/"),
    filename: "bundle.js",
    publicPath: "/"
  },

  devtool: "none",
  devServer: {
    contentBase: ".",
    hot: true,
    historyApiFallback: true
  },

  optimization: {
    minimize: false,
    splitChunks: { chunks: "all" }
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Dotenv({
      path: "./.env", // Path to .env file (this is the default)
      safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
      systemvars: true
    }),
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      title: "Schilder Portal - Shop der Hauser Feuerschutz AG",
      template: "index.ejs",
      /*accessToken: ROLLBAR_PUBLIC_ACCESS_TOKEN,*/
      version: VERSION
    })
  ],

  resolve: {
    modules: [path.resolve(context, "src"), "node_modules"],
    extensions: [".js", ".jsx", ".css", ".scss"],
    alias: {
      img: path.resolve(context, "img"),
      "react-dom": "@hot-loader/react-dom"
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
        exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,

        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: false,
                    targets: {
                      browsers: ["> 1%", "last 2 major versions", "IE 11"]
                    }
                  }
                ],
                "@babel/preset-react"
              ],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-class-properties",
                "babel-plugin-styled-components",
                "react-hot-loader/babel",
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
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: { import: false, sourceMap: true }
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
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: { import: false, sourceMap: true }
          },
          { loader: "postcss-loader", options: { sourceMap: true } },
          { loader: "resolve-url-loader" },
          { loader: "sass-loader", options: { sourceMap: true } }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|woff2?|eot|ttf|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      }
    ]
  }
};
