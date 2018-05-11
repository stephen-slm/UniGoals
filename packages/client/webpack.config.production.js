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
            comments: false,
            minified: true,
            env: {
              production: true,
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
  plugins: [],
};

module.exports = config;
