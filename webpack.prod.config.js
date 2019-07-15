/**
 * 生产环境的配置
 */

const webpack = require('webpack');
const config = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

config.output.publicPath = './dist/';

config.plugins = (config.plugins || []).concat([
    // 提取CSS
    new ExtractTextPlugin({
        filename: '[name].css',
        allChunks : true
    }),
    // 提取第三方库(从不同的bundle中提取所有的公共模块,并且将他们加入公共bundle中)
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors'
    }),
    // 构建html文件
    new HtmlWebpackPlugin({
        filename: '../index.html',
        template: './app/template/index.html',
        inject: 'body'
    })
]);

module.exports = config;
