const webpack = require('webpack');
const path    = require('path');

module.exports = {
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3333',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '../app/app.js')
  ],
  output: {
    devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath),
    filename: 'js/[name].js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    port: 3333,
    watchContentBase: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'DEFAULT_API_URL': JSON.stringify('http://localhost:3000'),
      'DEFAULT_CLIENT_ID': JSON.stringify('13671')
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  }
};
