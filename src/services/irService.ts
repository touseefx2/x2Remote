import * as ExpoIr from "expo-ir";
import {
  acCarrierHz,
  acPatternForBrand,
  tvCarrierHz,
  tvPatternForBrand,
  type AcIrCommand,
  type TvIrCommand,
} from "@/src/services/irBrandPatterns";
import { storageService } from "@/src/services/storageService";
import type { ACMode, FanSpeed, IRCapability } from "@/src/types/remote";
import { Platform } from "react-native";

export const TV_BRANDS = [
  { id: "samsung", name: "Samsung" },
  { id: "lg", name: "LG" },
  { id: "sony", name: "Sony" },
  { id: "haier", name: "Haier" },
  { id: "panasonic", name: "Panasonic" },
] as const;

export const AC_BRANDS = [
  { id: "gree", name: "Gree" },
  { id: "haier", name: "Haier" },
  { id: "samsung", name: "Samsung" },
  { id: "lg", name: "LG" },
  { id: "daikin", name: "Daikin" },
] as const;

async function transmitIr(carrierHz: number, pattern: number[]): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }
  return ExpoIr.transmit(carrierHz, pattern);
}

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

    try {
      const has = await ExpoIr.hasIrEmitter();
      return {
        supported: has,
        message: has ? undefined : "This phone has no IR blaster (ConsumerIr).",
        platform: "android",
        mockMode: false,
      };
    } catch {
      return {
        supported: false,
        message: "IR native module failed to load. Rebuild the app (expo run:android).",
        platform: "android",
        mockMode: true,
      };
    }
  },

  async setSelectedBrand(device: "tv" | "ac", brandId: string) {
    await storageService.setSelectedBrand(device, brandId);
  },

  async getSelectedBrand(device: "tv" | "ac") {
    return storageService.getSelectedBrand(device);
  },

  async sendTvCommand(command: TvIrCommand) {
    const brand = (await storageService.getSelectedBrand("tv")) ?? "samsung";
    const pattern = tvPatternForBrand(brand, command);
    const hz = tvCarrierHz(brand);
    return transmitIr(hz, pattern);
  },

  async sendAcPower() {
    const brand = (await storageService.getSelectedBrand("ac")) ?? "gree";
    const pattern = acPatternForBrand(brand, "power");
    return transmitIr(acCarrierHz(brand), pattern);
  },

  async sendAcTemperature(up: boolean) {
    const brand = (await storageService.getSelectedBrand("ac")) ?? "gree";
    const pattern = acPatternForBrand(brand, up ? "tempUp" : "tempDown");
    return transmitIr(acCarrierHz(brand), pattern);
  },

  async sendAcMode(mode: ACMode) {
    const brand = (await storageService.getSelectedBrand("ac")) ?? "gree";
    const key: AcIrCommand = mode === "cool" ? "modeCool" : mode === "heat" ? "modeHeat" : "modeFan";
    const pattern = acPatternForBrand(brand, key);
    return transmitIr(acCarrierHz(brand), pattern);
  },

  async sendAcFanSpeed(_speed: FanSpeed) {
    const brand = (await storageService.getSelectedBrand("ac")) ?? "gree";
    const pattern = acPatternForBrand(brand, "fanSpeed");
    return transmitIr(acCarrierHz(brand), pattern);
  },
};
