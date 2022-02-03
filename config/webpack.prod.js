const fs = require("fs");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zlib = require("zlib");

const paths = require("./paths");

module.exports = {
  mode: "production",
  cache: {
    type: "filesystem",
    store: "pack",
    buildDependencies: {
      config: [__filename],
      tsconfig: [paths.APP_JSCONFIG, paths.APP_TSCONFIG].filter(f => fs.existsSync(f)),
      // 默认情况下 webpack 与 loader 是构建依赖。
    },
  },
  optimization: {
    chunkIds: "deterministic",
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          filename: "js/[id]_vendors.js",
          priority: -10,
        },
        default: {
          minChunks: 2,
          filename: "js/common_[id].js",
          priority: -20,
        },
      },
    },
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // esbuild 是一款非常快速的 JavaScript 打包工具和压缩工具
        minify: TerserPlugin.esbuildMinify,
        // 启用/禁用多进程并发运行功能
        parallel: true,
        // 启用/禁用剥离注释功能
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // css 压缩
    new CssMinimizerPlugin(),
    // 把 css 放在单独文件里面
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].chunk.css",
      // 启用实验性的importModule方法，而不是使用子编译器。这样占用的内存更少，速度更快
      experimentalUseImportModule: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: paths.APP_PUBLIC,
          globOptions: {
            ignore: ["**/index.html", "**/.DS_Store"],
          },
        },
      ],
    }),
    // @ts-ignore
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        // @ts-ignore
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};
