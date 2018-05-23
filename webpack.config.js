const path = require("path");

const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

process.traceDeprecation = true; //https://github.com/webpack/loader-utils/issues/56

const context = __dirname;

module.exports = {
  mode: "development",

  context,

  entry: ["react-hot-loader/patch", path.join(context, "src/index.jsx")],

  output: {
    path: path.join(context, "dist/"),
    filename: "bundle.js",
    publicPath: "/dist"
  },

  devtool: "cheap-source-map",
  devServer: {
    contentBase: ".",
    hot: true,
    historyApiFallback: true
  },

  optimization: {
    minimize: false
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
    new BundleAnalyzerPlugin()
  ],

  resolve: {
    modules: [path.resolve(context, "src"), "node_modules"],
    extensions: [".js", ".jsx", ".css", ".scss"],
    alias: {
      img: path.resolve(context, "img")
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(context, "src")],

        use: [
          {
            loader: "react-hot-loader/webpack"
          },
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: false,
                    targets: {
                      browsers: ["> 1%", "last 2 major versions", "IE 10"]
                    }
                  }
                ],
                "@babel/preset-react"
              ],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "transform-class-properties",
                "babel-plugin-styled-components",
                "react-hot-loader/babel"
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
            options: { import: false, sourceMap: true, minimize: false }
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
            options: { import: false, sourceMap: true, minimize: false }
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
