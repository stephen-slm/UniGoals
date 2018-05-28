const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'public/components/js');
const APP_DIR = path.resolve(__dirname, 'application');

const config = {
  devtool: 'cheap-module-source-map',
  entry: `${APP_DIR}/index.jsx`,
  output: {
    path: BUILD_DIR,
    publicPath: 'components/js',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        include: APP_DIR,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: ['last 2 versions'],
                  },
                },
              ],
              'babel-preset-react',
              'es2015',
              'react',
              'stage-2',
            ],
            babelrc: false,
            comments: true,
            env: {
              production: false,
            },
          },
        },
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader?modules!less-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    hot: true,
    contentBase: './public',
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
  },
};

module.exports = config;
