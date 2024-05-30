const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { EsbuildPlugin } = require('esbuild-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// primary config:
const title = 'Slickgrid-React';
const baseUrl = '';
const outDevDir = path.resolve(__dirname, 'dist');
const outProdDir = path.resolve(__dirname, 'website');
const srcDir = path.resolve(__dirname, 'src');

module.exports = ({ production } = {}) => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [srcDir, 'node_modules'],
    alias: {
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
  entry: {
    app: [`${srcDir}/index`],
  },
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
    historyApiFallback: true,
    compress: true,
    hot: false,
    liveReload: true,
    port: 8080,
    host: 'localhost',
    open: true,
  },
  devtool: production ? false : 'source-map',
  module: {
    rules: [
      { test: /\.css$/i, use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'] },
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: { target: 'es2022' }
      },
      { test: /\.(sass|scss)$/, use: ['style-loader', 'css-loader', 'sass-loader'], issuer: /\.[tj]sx?$/i },
      { test: /\.(sass|scss)$/, use: ['css-loader', 'sass-loader'], issuer: /\.html?$/i },
      { test: /\.html$/i, loader: 'html-loader', options: { esModule: false } },
      { test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' },
      { test: /\.(woff|woff2|eot|ttf|otf)$/i, type: 'asset/resource', },
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, type: 'asset/resource', },
    ],
  },
  optimization: {
    minimizer: [
      new EsbuildPlugin({
        target: 'es2022',
        format: 'iife',
        css: true,
      })
    ]
  },
  plugins: [
    // ref: https://webpack.js.org/plugins/mini-css-extract-plugin/
    new MiniCssExtractPlugin({ // updated to match the naming conventions for the js files
      filename: '[name].[contenthash].bundle.css',
      chunkFilename: '[name].[contenthash].chunk.css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${srcDir}/assets`, to: 'assets' }
      ]
    }),
    // Note that the usage of following plugin cleans the webpack output directory before build.
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: `${srcDir}/favicon.ico`,
      template: './src/index.html',
      metadata: {
        title, baseUrl
      }
    }),
  ]
});
