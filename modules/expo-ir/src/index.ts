import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

type ExpoIrNative = {
  transmit(carrierFrequency: number, pattern: number[]): Promise<boolean>;
  hasIrEmitter(): Promise<boolean>;
};

let native: ExpoIrNative | null = null;

if (Platform.OS === "android") {
  try {
    native = requireNativeModule<ExpoIrNative>("ExpoIr");
  } catch {
    native = null;
  }
}

export async function transmit(carrierFrequency: number, pattern: number[]): Promise<boolean> {
  if (!native) return false;
  return native.transmit(carrierFrequency, pattern);
}

export async function hasIrEmitter(): Promise<boolean> {
  if (!native) return false;
  return native.hasIrEmitter();
}
