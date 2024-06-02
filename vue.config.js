module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/UnifiedAuthPlatformPortal/" : "/",
  configureWebpack: {
    devtool: 'source-map'
  }
};
