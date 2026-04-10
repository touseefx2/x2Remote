import { discoverLanDevices, isNativeDiscoveryAvailable } from "@/src/services/mdnsDiscovery";
import { sendLanTvCommand } from "@/src/services/lanTvControl";
import { storageService } from "@/src/services/storageService";
import type { PairingState, SmartDevice, SmartDeviceType } from "@/src/types/remote";

/** Demo list when running on web or without the native zeroconf module (e.g. Expo Go). */
const mockDiscovery: SmartDevice[] = [
  {
    id: "cast-living-room",
    name: "Living Room Android TV",
    type: "smart_tv",
    ip: "192.168.1.41",
    protocol: "cast",
    vendor: "chromecast",
    paired: false,
  },
  {
    id: "cast-bedroom",
    name: "Bedroom Smart AC",
    type: "smart_ac",
    ip: "192.168.1.42",
    protocol: "mdns",
    vendor: "homekit_ac",
    paired: false,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type DiscoverDevicesOptions = {
  /** Called when a new device is found (mDNS resolves). Only used with native discovery. */
  onDevice?: (device: SmartDevice) => void;
};

export const smartDeviceService = {
  async discoverDevices(options?: DiscoverDevicesOptions): Promise<SmartDevice[]> {
    const paired = await storageService.getPairedDevices();
    const pairedSet = new Set(paired.map((item) => item.id));

    if (isNativeDiscoveryAvailable()) {
      return discoverLanDevices({
        pairedIds: pairedSet,
        onDevice: options?.onDevice,
      });
    }

    await delay(400);
    return mockDiscovery.map((item) => ({
      ...item,
      paired: pairedSet.has(item.id),
    }));
  },

  async pairDevice(device: SmartDevice): Promise<PairingState> {
    await delay(600);
    await storageService.upsertPairedDevice(device);
    return "paired";
  },

  async sendTvCommand(
    device: SmartDevice,
    command: "power" | "volumeUp" | "volumeDown" | "navUp" | "navDown" | "appYoutube",
  ) {
    return sendLanTvCommand(device, command);
  },

  async sendAcCommand(
    _device: SmartDevice,
    _command: "power" | "tempUp" | "tempDown" | "mode" | "fan",
  ) {
    return false;
  },

  filterByType(devices: SmartDevice[], type: SmartDeviceType | "all") {
    if (type === "all") return devices;
    return devices.filter((item) => item.type === type);
  },
};
