const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add fallbacks for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify'),
    zlib: require.resolve('browserify-zlib'),
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
  };

  // Add plugins for global polyfills
  config.plugins = [
    ...(config.plugins || []), // Preserve existing plugins
    new webpack.ProvidePlugin({
      process: 'process/browser', // Provide the `process` polyfill
      Buffer: ['buffer', 'Buffer'], // Provide the `Buffer` polyfill
    }),
  ];

  // Ensure the `process` polyfill is included in the build
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false, // Disable fullySpecified to allow module resolution without file extensions
    },
  });

  return config;
};