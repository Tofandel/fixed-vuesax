const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // modify the options...
        options.whitespace = 'condense';
        return options;
      });
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin(
        {
          patterns: [{
            from: 'src/style',
            to: 'style/',
            toType: 'dir',
          }],
        },
      ),
    ],
  },
};
