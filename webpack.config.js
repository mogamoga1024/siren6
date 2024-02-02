const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production', // development
  entry: './src/main.js',
  output: {
    publicPath: '/dist/',
    filename: 'main.js'
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname),
    },
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js'
    }
  },
};
