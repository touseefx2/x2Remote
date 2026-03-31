// https://docs.expo.dev/guides/customizing-metro/
// Disables Watchman so Metro uses the Node file crawler. Fixes macOS errors like:
// "Watchman error: ... open: <project>: Operation not permitted"
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  useWatchman: false,
};

module.exports = config;
