const webpack = require('webpack');
const path    = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist/assets'),
    publicPath: '/assets/'
  },
  resolve: {
    alias: {
      vendor: path.resolve(__dirname, '../vendor/'),
      assets: path.resolve(__dirname, '../app/assets/'),
      stylesheets: path.resolve(__dirname, '../app/stylesheets/')
    },
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new CleanWebpackPlugin(['dist/assets'], {
      root: path.resolve(__dirname, '../')
    }),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      filename: path.join('../index.html'),
      inject: 'body',
      template: path.join(__dirname, '../app/index.html')
    }),
    new HtmlWebpackHarddiskPlugin(),
    new FaviconsWebpackPlugin(path.join(__dirname, '../app/assets/images/favicon.svg')),
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!isomorphic-fetch',
      'Promise': 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|otf|ttf|svg)$/,
        exclude: [path.resolve(__dirname, '../app/assets')],
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '/assets/',
            outputPath: 'fonts/',
            useRelativePath: false
          }
        }
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        exclude: [path.resolve(__dirname, '../app/assets')],
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '/assets/',
            outputPath: 'images/',
            useRelativePath: false
          }
        }
      },
      {
        test: /.*/,
        include: [path.resolve(__dirname, '../app/assets')],
        use: {
          loader: 'file-loader',
          options: {
            context: path.resolve(__dirname, '../app/assets'),
            name: '[path]/[name].[ext]'
          }
        }
      },
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            failOnWarning: false,
            failOnError: false
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
