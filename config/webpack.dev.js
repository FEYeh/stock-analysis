const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const paths = require("./paths");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  cache: {
    type: "memory",
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    hot: true,
    open: true,
    static: {
      directory: paths.APP_PUBLIC,
    },
    proxy: [
      {
        context: ["/shdjt"],
        target: 'http://www.shdjt.com',
        pathRewrite: { "^/shdjt": "" },
        secure: true,
        changeOrigin: true,
        cookieDomainRewrite: {
          "*": "",
        },
      },
      {
        context: ["/gtimg"],
        target: 'http://web.ifzq.gtimg.cn',
        pathRewrite: { "^/gtimg": "" },
        secure: true,
        changeOrigin: true,
        cookieDomainRewrite: {
          "*": "",
        },
      },
    ]
  },
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  ],
};
