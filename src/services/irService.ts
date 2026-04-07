import { storageService } from "@/src/services/storageService";
import type { ACMode, DeviceBrand, FanSpeed, IRCapability } from "@/src/types/remote";
import { NativeModules, Platform } from "react-native";

type IRNativeModule = {
  hasIrEmitter?: () => Promise<boolean>;
  transmit?: (carrierFrequency: number, pattern: number[]) => Promise<boolean>;
};

const IR_FREQUENCY = 38000;
const IRModule = NativeModules.IRModule as IRNativeModule | undefined;
const USE_MOCK = !IRModule;

export const TV_BRANDS: DeviceBrand[] = [
  { id: "samsung", name: "Samsung" },
  { id: "lg", name: "LG" },
  { id: "sony", name: "Sony" },
  { id: "haier", name: "Haier" },
  { id: "panasonic", name: "Panasonic" },
];

export const AC_BRANDS: DeviceBrand[] = [
  { id: "gree", name: "Gree" },
  { id: "haier", name: "Haier" },
  { id: "samsung", name: "Samsung" },
  { id: "lg", name: "LG" },
  { id: "daikin", name: "Daikin" },
];

const tvPatterns: Record<string, number[]> = {
  power: [9000, 4500, 560, 1690],
  volumeUp: [9000, 4500, 560, 560],
  volumeDown: [9000, 4500, 560, 1120],
  channelUp: [9000, 4500, 1120, 560],
  channelDown: [9000, 4500, 1120, 1120],
};

const acPatterns: Record<string, number[]> = {
  power: [3400, 1700, 450, 450],
  tempUp: [3400, 1700, 450, 900],
  tempDown: [3400, 1700, 900, 450],
  fanSpeed: [3400, 1700, 900, 900],
  modeCool: [3400, 1700, 450, 1350],
  modeHeat: [3400, 1700, 1350, 450],
  modeFan: [3400, 1700, 1350, 900],
};

const transmit = async (pattern: number[]): Promise<boolean> => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return true;
  }

  if (!IRModule?.transmit) {
    return false;
  }

  return IRModule.transmit(IR_FREQUENCY, pattern);
};

export const irService = {
  async getCapability(): Promise<IRCapability> {
    if (Platform.OS === "ios") {
      return {
        supported: false,
        message: "IR Blaster not available on this device.",
        platform: "ios",
        mockMode: true,
      };
    }

    if (Platform.OS !== "android") {
      return {
        supported: false,
        message: "IR Blaster not available on this device.",
        platform: "other",
        mockMode: true,
      };
    }

    if (USE_MOCK || !IRModule?.hasIrEmitter) {
      return {
        supported: true,
        platform: "android",
        mockMode: true,
      };
    }

    const supported = await IRModule.hasIrEmitter();
    return {
      supported,
      message: supported ? undefined : "IR Blaster not available on this device.",
      platform: "android",
      mockMode: false,
    };
  },

  async setSelectedBrand(device: "tv" | "ac", brandId: string) {
    await storageService.setSelectedBrand(device, brandId);
  },

  async getSelectedBrand(device: "tv" | "ac") {
    return storageService.getSelectedBrand(device);
  },

  async sendTvCommand(
    command: "power" | "volumeUp" | "volumeDown" | "channelUp" | "channelDown",
  ) {
    return transmit(tvPatterns[command]);
  },

  async sendAcPower() {
    return transmit(acPatterns.power);
  },

  async sendAcTemperature(up: boolean) {
    return transmit(up ? acPatterns.tempUp : acPatterns.tempDown);
  },

  async sendAcMode(mode: ACMode) {
    if (mode === "cool") return transmit(acPatterns.modeCool);
    if (mode === "heat") return transmit(acPatterns.modeHeat);
    return transmit(acPatterns.modeFan);
  },

  async sendAcFanSpeed(_speed: FanSpeed) {
    return transmit(acPatterns.fanSpeed);
  },
};
