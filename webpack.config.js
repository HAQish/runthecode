var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './client/src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'client/dist'),
    filename: 'bundle.js'
  },
  devtool:'cheap-eval-source-map',
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  module: {
    loaders: [
    {
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    },
    {
      test: /\.css$/,
      loader: 'css-loader'
    }]
  }
};