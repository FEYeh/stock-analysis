const { merge } = require("webpack-merge");

const prodConfig = require("./config/webpack.prod");
const devConfig = require("./config/webpack.dev");

module.exports = (env, args) => {
  process.env.NODE_ENV = args.mode;

  const baseConfig = require("./config/webpack.base");

  switch (args.mode) {
    case "development":
      // @ts-ignore
      return merge(baseConfig, devConfig);
    case "production":
      // @ts-ignore
      return merge(baseConfig, prodConfig);
    default:
      throw new Error("No matching configuration was found!");
  }
};
