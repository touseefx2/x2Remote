import { storageService } from "@/src/services/storageService";
import type { PairingState, SmartDevice, SmartDeviceType } from "@/src/types/remote";

const mockDiscovery: SmartDevice[] = [
  {
    id: "cast-living-room",
    name: "Living Room Android TV",
    type: "smart_tv",
    ip: "192.168.1.41",
    protocol: "cast",
    paired: false,
  },
  {
    id: "cast-bedroom",
    name: "Bedroom Smart AC",
    type: "smart_ac",
    ip: "192.168.1.42",
    protocol: "mdns",
    paired: false,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const smartDeviceService = {
  async discoverDevices(): Promise<SmartDevice[]> {
    // mDNS/SSDP are represented through protocol tags here.
    await delay(700);
    const paired = await storageService.getPairedDevices();
    const pairedSet = new Set(paired.map((item) => item.id));

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
    _device: SmartDevice,
    _command: "power" | "volumeUp" | "volumeDown" | "navUp" | "navDown" | "appYoutube",
  ) {
    await delay(200);
    return true;
  },

  async sendAcCommand(
    _device: SmartDevice,
    _command: "power" | "tempUp" | "tempDown" | "mode" | "fan",
  ) {
    await delay(200);
    return true;
  },

  filterByType(devices: SmartDevice[], type: SmartDeviceType | "all") {
    if (type === "all") return devices;
    return devices.filter((item) => item.type === type);
  },
};
