const path              = require('path');
const webpack           = require('webpack');
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const RobotstxtPlugin   = require('robotstxt-webpack-plugin').default;

module.exports = {
  entry: [
    'babel-polyfill',
    path.join(__dirname, '../app/app.js')
  ],
  output: {
    filename: 'js/[name].[chunkhash].js'
  },
  devtool: 'nosources-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'DEFAULT_API_URL': JSON.stringify('https://grimoire.destiny.community/rasputin'),
      'DEFAULT_CLIENT_ID': JSON.stringify('20829')
    }),
    new ExtractTextPlugin('css/app.[chunkhash].css'),
    new RobotstxtPlugin({
      dest: '../',
      host: 'https://grimoire.destiny.community',
      policy: [ { userAgent: '*', allow: '/' } ],
      sitemap: 'https://grimoire.destiny.community/sitemap.xml.gz'
    }),
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true,
      uglifyOptions: { ecma: 6 }
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader']
        })
      },
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      }
    ]
  }
};
