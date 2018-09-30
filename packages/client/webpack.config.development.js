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
            comments: false,
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      production: false,
    }),
  ],
  devServer: {
    hot: true,
    contentBase: './public',
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
  },
};

module.exports = config;
