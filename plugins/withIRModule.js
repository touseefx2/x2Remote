const { AndroidConfig, withAndroidManifest } = require("expo/config-plugins");

const withIRModule = (config) => {
  return withAndroidManifest(config, (mod) => {
    const usesFeatures = mod.modResults.manifest["uses-feature"] ?? [];
    const hasIRFeature = usesFeatures.some(
      (item) => item.$["android:name"] === "android.hardware.consumerir",
    );

    if (!hasIRFeature) {
      usesFeatures.push({
        $: {
          "android:name": "android.hardware.consumerir",
          "android:required": "false",
        },
      });
      mod.modResults.manifest["uses-feature"] = usesFeatures;
    }

    return mod;
  });
};

module.exports = withIRModule;
