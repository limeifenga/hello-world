# webpack

-概念
    本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。
    当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，
    其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

-核心

入口(entry)
输出(output)
loader
插件(plugins)

-loader  进行转换
 -test 属性，用于标识出 进行转换的某个或某些文件。
 -use 属性，表示进行转换时，应该使用哪个 模块。

 cmodule.exports  = {
   output: {
     filename: 'my-first-webpack.bundle.js'
   },
   module: {
     rules: [
       { test: /\.txt$/, use: 'raw-loader' }
     ]
   }
 };

 “嘿，webpack 编译器，当你碰到「在 require()/import 语句中被解析为 '.txt' 的路径」时，
 在你对它打包之前，先使用 raw-loader 转换一下。”

 loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，
 从打包优化和压缩，一直到重新定义环境中的变量

 const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
 const webpack = require('webpack'); // 用于访问内置插件

 const config = {
   module: {
     rules: [
       { test: /\.txt$/, use: 'raw-loader' }
       {test: /\.(js|jsx)$/,use: 'babel-loader'}
     ]
   },
   plugins: [
     new HtmlWebpackPlugin({template: './src/index.html'})
   ]
 };

 module.exports = config;






