/**
 * 开发环境的配置
 */

var webpack = require('webpack');
var config = require('./webpack.base.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');

config.devtool = '#source-map';                             // source-map
config.output.publicPath = '/dist/';                        // 资源路径
config.output.filename = '[name].js';                       // 入口js命名
config.output.chunkFilename = '[name].chunk.js';            // 路由js命名

config.plugins = (config.plugins || []).concat([
    // 提取CSS
    new ExtractTextPlugin("[name].css",{ allChunks : true,resolve : ['modules'] }),
    // 提取第三方库
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    // 构建html文件
    new HtmlWebpackPlugin({
        filename: '../index.html',
        template: './app/template/index.html',
        inject: 'body'
    })
]);

// 写入环境变量
fs.open('./app/config/env.js', 'w', function (err, fd) {
    var buf = 'module.exports = "development";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer){
        return err;
    });
});

module.exports = config;