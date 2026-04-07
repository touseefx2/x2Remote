import { AndroidConfig, ConfigPlugin, withAndroidManifest } from "expo/config-plugins";

const withIRModule: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (mod) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(mod.modResults);

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

    app.$["tools:ignore"] = "MissingClass";
    return mod;
  });
};

export default withIRModule;
