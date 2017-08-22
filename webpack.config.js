var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: './assets',
  entry: {
    main: ['./js/main.js', './css/main.css']
  },
  output: {
    path: './dist',
    filename: 'js/[name].[chunkhash:6].js'
  },
  module: {
    loaders: [
      // Extract css files
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader?url=false')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/[name]-[contenthash:6].css')
  ]
};
