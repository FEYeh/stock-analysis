const { DefinePlugin, ProvidePlugin } = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");

// 这个模块要在 paths 之前引入，加载正确的 path_url
const getClientEnvironment = require("./env");

const paths = require("./paths");

const isProduction = process.env.NODE_ENV === "production";

const env = getClientEnvironment(paths.PUBLIC_URL_OR_PATH.slice(0, -1));

module.exports = {
  target: "browserslist",
  entry: paths.APP_INDEX_JS,
  output: {
    path: paths.APP_BUILD,
    pathinfo: isProduction ? false : true,
    filename: isProduction ? "js/[name].[contenthash:8].js" : "js/bundle.js",
    chunkFilename: isProduction ? "js/[name].[contenthash:8].chunk.js" : "js/[name].chunk.js",
    assetModuleFilename: "assets/[hash][ext][query]",
    publicPath: paths.PUBLIC_URL_OR_PATH, // 后面从 env 读取
  },
  module: {
    // 导入一个内容，没有对应的导出时，报一个警告，设置为 true，报一个错误
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        include: paths.APP_SRC,
        loader: "esbuild-loader",
        options: {
          loader: "tsx",
          target: "es2015",
        },
      },
      {
        test: /\.css$/,
        include: paths.APP_SRC,
        use: [
          isProduction
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  // 路径：/css/assets 所以写成 ../
                  publicPath: "../",
                },
              }
            : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/,
        include: paths.APP_SRC,
        use: [
          isProduction
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  // 路径：/css/assets 所以写成 ../
                  publicPath: "../",
                },
              }
            : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
        type: "asset",
        generator: {
          filename: "assets/images/[hash][ext][query]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024, // 1mb
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext][query]",
        },
      },
    ],
  },
  resolve: {
    extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
    alias: {
      "@": paths.APP_SRC,
    },
  },
  plugins: [
    new ProvidePlugin({
      React: "react",
    }),
    new DefinePlugin(env.stringified),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin(
      Object.assign(
        {
          inject: true,
          template: paths.APP_HTML,
        },
        isProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
      )
    ),
    // @ts-ignore
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
  ],
};
