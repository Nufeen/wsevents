import config from './project.json'

import webpack from 'webpack'
import path from 'path'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const PUBLIC_URL = config.url.cdn
const CDN_URL = config.url.cdn

const svgoPlugins = [
  {
    removeTitle: true,
  },
  {
    convertPathData: true,
  },
  {
    mergePaths: true,
  },
  {
    cleanupIDs: false,
  },
  {
    convertTransform: true,
  },
  {
    removeViewBox: false,
  },
  {
    collapseGroups: false,
  },
]

const appConfig = (env, args) => ({
  devtool: args.mode == 'production' ? 'none' : 'source-map',

  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, ''),
    ],
  },

  entry: {
    app: 'index.js',
  },

  output: {
    chunkFilename: '[name].[chunkhash:4].js',
    filename: chunkData => {
      return /inject|widget-/.test(chunkData.chunk.name)
        ? '[name].js'
        : '[name].[chunkhash:4].js'
    },
    publicPath: args.mode == 'production' ? CDN_URL : '',
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /mobx|react/,
          chunks: 'initial',
          priority: 2,
        },
        core: {
          name: 'core',
          test: /core-js/,
          chunks: 'initial',
          priority: 2,
        },
        moment: {
          name: 'moment',
          test: /moment/,
          chunks: 'initial',
          priority: 2,
        },
        fetch: {
          name: 'fetch',
          test: /fetch/,
          chunks: 'initial',
          priority: 2,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules(?!\/ansi-regex)(?!\/strip-ansi)/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.css$/,
        exclude: /module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: 'global',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: args.mode == 'development',
              config: {
                ctx: {
                  env: args.mode,
                },
              },
            },
          },
        ],
      },

      {
        test: /module\.css$/,
        include: path.resolve(__dirname, '../'),

        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: {
                mode: 'local',
                context: path.resolve(__dirname, 'src'),
                hashPrefix: Math.random().toString(32),
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: args.mode == 'development',
              config: {
                ctx: {
                  env: args.mode,
                },
              },
            },
          },
        ],
      },

      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'raw-loader',
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: svgoPlugins,
            },
          },
        ],
      },
      {
        exclude: /\.(m?js|css|html|json|svg|jpe?g|gif|png)$/i,
        loader: 'file-loader',
        options: { name: '[name].[hash:4].[ext]' },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      DEBUG: args.mode == 'development',
      PUBLIC_URL: JSON.stringify(args.mode == 'production' ? PUBLIC_URL : ''),
      CDN_URL: JSON.stringify(args.mode == 'production' ? CDN_URL : ''),
    }),

    new HtmlWebPackPlugin({
      id: config.name,
      title: config.title,
      template: './src/index.html',
      filename: './index.html',
      chunks: ['app', 'vendor'],
    }),

    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),

    new CopyWebpackPlugin([
      {
        context: __dirname,
        from: 'src/assets',
        to: 'src/assets',
      },
      {
        context: __dirname,
        from: 'src/data',
        to: 'src/data',
      },
    ]),
  ],
})

module.exports = [appConfig]
