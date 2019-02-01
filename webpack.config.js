const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { alias } = require(path.resolve(__dirname, 'src/assets/scripts/alias.js'));
const src = path.join(__dirname, 'src');

const clientHost = process.env.HOST || '127.0.0.1';
const clientPort = process.env.PORT || 9000;

module.exports = (env, argv) => {
  const config = {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]
        },
        {
          type: 'javascript/auto',
          test: /\.json$/,
          exclude: /node_modules/,
          use: 'json-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader']
        },
        {
          test: /\.(sa|sc|c)ss$/,
          include: [
            path.resolve(__dirname, './src/components')
          ],
          use: [
            'style-loader',
            {
              loader: 'css-loader'
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: [
            path.resolve(__dirname, './src/components')
          ],
          use: [
            'style-loader',
            {
              loader: 'css-loader'
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader',
          options: {
            name: 'images/[name]_[hash:7].[ext]',
          }
        },
        {
          test: /\.(mp4)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader',
          options: {
            name: 'videos/[name]_[hash:7].[ext]',
          }
        },
        {
          test: /\.(svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]_[hash:7].[ext]',
          }
        }
    ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, './public', 'index.html'),
        filename: "./index.html"
      })
    ],
    resolve: {
      modules: [src, 'node_modules'],
      alias: alias(path.resolve(__dirname))
    },

    // -- Build production
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: '0.vendor',
            chunks: 'all',
          }
        }
      },
      runtimeChunk: false
    },

    devServer: {
      port: clientPort,
      host: clientHost,
      historyApiFallback: true,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      disableHostCheck: true,
    }
  }

  if (argv.mode == 'production') {
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: '0.vendor',
            chunks: 'all',
          }
        }
      },
      runtimeChunk: false
    }
    config.plugins.push(
      new CleanWebpackPlugin([path.resolve(__dirname, './dist')], {
        root: process.cwd(),
        verbose: true,
        dry: false
      }),
      new OptimizeCssAssetsPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: true
      })
    );
  }
  return config;
};