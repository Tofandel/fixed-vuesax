const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
        options.compilerOptions = {
          whitespace: 'condense',
        };
        return options;
      });
  },
  configureWebpack: {
    plugins: [
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: {
            drop_console: true,
            unsafe_methods: true,
            unsafe_proto: true,
          },
          output: {
            comments: false,
            beautify: false,
          },
        },
        extractComments: false,
      }),
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
