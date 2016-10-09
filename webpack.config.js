const path = require('path')

module.exports = {
  entry: './src/index.jsx',
  output: { path: path.join(__dirname, 'public'), filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
