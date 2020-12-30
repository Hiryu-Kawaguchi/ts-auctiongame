module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  configureWebpack: {
    devtool: 'source-map'
  }
};