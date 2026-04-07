import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SmartDevice } from "@/src/types/remote";

const KEYS = {
  selectedTvBrand: "selected_tv_brand",
  selectedAcBrand: "selected_ac_brand",
  pairedDevices: "paired_devices",
} as const;

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const storageService = {
  async getSelectedBrand(device: "tv" | "ac") {
    const key = device === "tv" ? KEYS.selectedTvBrand : KEYS.selectedAcBrand;
    return AsyncStorage.getItem(key);
  },

  async setSelectedBrand(device: "tv" | "ac", brandId: string) {
    const key = device === "tv" ? KEYS.selectedTvBrand : KEYS.selectedAcBrand;
    await AsyncStorage.setItem(key, brandId);
  },

  async getPairedDevices(): Promise<SmartDevice[]> {
    const raw = await AsyncStorage.getItem(KEYS.pairedDevices);
    return safeParse<SmartDevice[]>(raw, []);
  },

  async upsertPairedDevice(device: SmartDevice) {
    const current = await storageService.getPairedDevices();
    const next = current.filter((item) => item.id !== device.id);
    next.push({ ...device, paired: true });
    await AsyncStorage.setItem(KEYS.pairedDevices, JSON.stringify(next));
  },
};
