const webpack = require('webpack'); // 用于访问内置插件
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装

module.exports = {
  entry:'./src/index.js',
  output: {
    path: path.resolve(__dirname,"./dist"),
    filename: "bundle.js"
  },
  /**
   * loader 转换
   * test属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
   * use 属性，表示进行转换时，应该使用哪个 loader。
   * */
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  /** plugins 插件
   * 想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。
   * 多数插件可以通过选项(option)自定义。
   * */
  plugins: [
    new HtmlWebpackPlugin({template: './index.html'})
  ]
}
