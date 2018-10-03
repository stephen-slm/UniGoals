const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/components/js');
const APP_DIR = path.resolve(__dirname, 'application');

const config = {
  entry: `${APP_DIR}/index.jsx`,
  output: {
    path: BUILD_DIR,
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
            minified: true,
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
  plugins: [],
};

module.exports = config;
