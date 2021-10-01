const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  entry: {
    server: './bin/www',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins 
        test: /\.html$/,
        use: [{ loader: "html-loader" }]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: "sample-orders/*.json",
            to({ context, absoluteFilename }) {
              return "[name].json";
            },
          },
          {
            from: "sample-order-history/*.json",
            to({ context, absoluteFilename }) {
              return "[name].json";
            },
          },
        ],
      }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      excludeChunks: ['server']
    })
  ]
}
