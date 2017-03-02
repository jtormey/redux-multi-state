
let HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './frontend/index.jsx',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './frontend/index.html'
    })
  ]
}
