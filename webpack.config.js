const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
var randomstring = require("randomstring");
module.exports = {
  //path to entry paint
  entry: "./src/scripts/index.js",
  //path and filename of the final output
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `main-${randomstring.generate(4)}.js`,
  },
  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    // new webpack.optimize.LimitChunkCountPlugin({  //limit num of chunks bundled as output
    //   maxChunks: 1,
    // }),
  ],
};
