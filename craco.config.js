module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable CSS minimizer to avoid issues with complex CSS patterns
      if (webpackConfig.optimization && webpackConfig.optimization.minimizer) {
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
          (minimizer) => minimizer.constructor.name !== 'CssMinimizerPlugin'
        );
      }
      return webpackConfig;
    },
  },
};
