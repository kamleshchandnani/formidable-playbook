"use strict";

var path = require("path");
var webpack = require("webpack");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

// Need **independent** webpack configs for tree-shaking to correctly determine
// unused libraries.
var ENTRY_POINTS = [
  // Hoisted examples.
  {
    filename: "app3",
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
  },
  {
    filename: "app3.min",
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),

      new webpack.optimize.UglifyJsPlugin({
        compress: true,
        mangle: false,    // DEMO ONLY: Don't change variable names.
        beautify: true,   // DEMO ONLY: Preserve whitespace
        output: {
          comments: true  // DEMO ONLY: Helpful comments
        },
        sourceMap: false
      })
    ]
  },

  // Baseline non-hoisted examples.
  {
    filename: "app3.nohoist"
  },
  {
    filename: "app3.nohoist.min",
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: true,
        mangle: false,    // DEMO ONLY: Don't change variable names.
        beautify: true,   // DEMO ONLY: Preserve whitespace
        output: {
          comments: true  // DEMO ONLY: Helpful comments
        },
        sourceMap: false
      })
    ]
  }
];

module.exports = ENTRY_POINTS.map(function (entry) {
  return {
    context: path.join(__dirname, "../src/es6"),
    entry: {
      app3: "./app3.js"
    },
    output: {
      path: path.join(__dirname, "dist/js"),
      filename: entry.filename + ".js",
      pathinfo: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.join(__dirname, "../src/es6")],
          loader: "babel-loader",
          query: {
            presets: [
              [
                "es2015",
                {
                  "modules": false
                }
              ]
            ]
          }
        }
      ]
    },
    plugins: [
      new StatsWriterPlugin({
        filename: "../stats-" + entry.filename + ".js",
        fields: null
      })
    ].concat(entry.plugins || [])
  };
});
