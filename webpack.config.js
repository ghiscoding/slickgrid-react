const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProvidePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// primary config:
const title = 'React Navigation Skeleton';
const outDevDir = path.resolve(__dirname, 'dist');
const outProdDir = path.resolve(__dirname, 'docs');
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '';

module.exports = ({ production } = {}, { server } = {}) => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [srcDir, 'node_modules'],
    alias: {
      'jquery': path.join(__dirname, 'node_modules/jquery/dist/jquery'),
      moment$: 'moment/moment.js'
    },
    fallback: {
      http: false,
      https: false,
      stream: false,
      util: false,
      zlib: false,
    }
  },
  entry: `${srcDir}/index`,
  mode: production ? 'production' : 'development',
  output: {
    path: production ? outProdDir : outDevDir,
    publicPath: baseUrl,
    filename: '[name].[contenthash].bundle.js',
    sourceMapFilename: '[name].[contenthash].bundle.js.map',
    chunkFilename: '[name].[contenthash].chunk.js',
  },
  stats: {
    warnings: false
  },
  target: 'web',
  performance: { hints: false },
  devServer: {
    static: {
      directory: production ? outProdDir : outDevDir,
    },
    // serve index.html for all 404 (required for push-state)
    historyApiFallback: true,
    compress: true,
    hot: false,
    liveReload: true,
    port: 9000,
    host: 'localhost',
    open: true,
  },
  devtool: production ? false : 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader']
      },
      { test: /\.(sass|scss)$/, use: ['style-loader', 'css-loader', 'sass-loader'], issuer: /\.[tj]s$/i },
      { test: /\.(sass|scss)$/, use: ['css-loader', 'sass-loader'], issuer: /\.html?$/i },
      { test: /\.html$/i, loader: 'html-loader' },
      { test: /\.ts?$/, use: 'ts-loader', exclude: nodeModulesDir, },
      { test: /\.(woff|woff2|eot|ttf|otf)$/i, type: 'asset/resource', },
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, type: 'asset/resource', },
    ]
  },
  plugins: [
    new ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: `${srcDir}/favicon.ico`,
      metadata: {
        title, server, baseUrl
      }
    }),
    // ref: https://webpack.js.org/plugins/mini-css-extract-plugin/
    new MiniCssExtractPlugin({ // updated to match the naming conventions for the js files
      filename: '[name].[contenthash].bundle.css',
      chunkFilename: '[name].[contenthash].chunk.css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${srcDir}/favicon.ico`, to: 'favicon.ico' },
        { from: `${srcDir}/assets`, to: 'assets' }
      ]
    }),

    // Note that the usage of following plugin cleans the webpack output directory before build.
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ]
});
