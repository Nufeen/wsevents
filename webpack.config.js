const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction ? '???' : '';

// __webpack_public_path__ = process.env.ASSET_PATH;

const baseConfig = {
  context: __dirname,

  devServer: {
    inline: true,
    port: 8080,
    disableHostCheck: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: '.babel_cache',
              presets: [
                [
                  'es2015',
                  {
                    modules: false,
                  },
                ],
                'react',
              ],
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: path.resolve(__dirname, 'src'),
            },
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              interpolate: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: ctx => [
                require('postcss-import')({
                  addDependencyTo: ctx,
                }),
                require('postcss-url')({
                  url: 'rebase',
                }),
                require('postcss-cssnext')({
                  browsers: ['> 1%', 'ie > 9'],
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(svg)$/,
        use: 'raw-loader',
      },
      {
        test: /.+/i,
        exclude: /\.(js|html|svg|css|json)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './assets/[name].[ext]',
              context: path.resolve(__dirname, 'src'),
            },
          },
        ],
      },
    ],
  },

  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
  },

  devtool: isProduction ? false : 'cheap-module-eval-source-map',

  plugins: [
    new webpack.DefinePlugin({
      __PRODUCTION__: isProduction,
      __DEVELOPMENT__: !isProduction,
      __PUBLIC_PATH__: JSON.stringify(publicPath),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      debug: !isProduction,
    }),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/assets',
          to: 'src/assets',
        },
        {
          from: 'src/data',
          to: 'src/data',
        },
      ],
      {
        copyUnmodified: false,
      }
    ),
    ...(isProduction ? [new webpack.optimize.UglifyJsPlugin()] : []),
  ],
};

module.exports = [
  webpackMerge(baseConfig, {
    entry: {
      index: './src/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle/[name].js',
      publicPath,
    },
  }),
];
