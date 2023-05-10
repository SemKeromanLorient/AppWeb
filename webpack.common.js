const path = require('path')
const webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = { 
    entry: './src/index.js',
  
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: false
      })
    ],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'index.bundle.js',
      assetModuleFilename: './src/assets/[hash][ext][query]',
      publicPath: '/'
    },
    module: {
      rules: [
        {test: /\.js$/, exclude: /node_modules/, use: 'babel-loader'},
        {test: /\.css$/i, use: ["style-loader", "css-loader"]},
        {
            test: /\.svg$/,
            use: ['@svgr/webpack', 'url-loader'],
        }
      ]   
    },
  }