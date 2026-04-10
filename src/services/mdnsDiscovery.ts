import type { SmartDevice, SmartDeviceType, SmartDeviceVendor } from "@/src/types/remote";
import { NativeModules, Platform } from "react-native";
import Zeroconf, { ImplType } from "react-native-zeroconf";

const RNZeroconf = NativeModules.RNZeroconf;

type ZeroconfService = {
  name: string;
  fullName?: string;
  host?: string;
  port?: number;
  addresses?: string[];
  txt?: Record<string, string>;
};

type ScanTarget = {
  serviceType: string;
  map: (svc: ZeroconfService, pairedIds: Set<string>) => SmartDevice | null;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SCAN_MS_PER_TYPE = 3200;
const GAP_AFTER_STOP_MS = 450;

const acNameHint =
  /thermostat|ac\b|air[\s-]?con|hvac|climate|cooling|heating|midea|daikin|gree|mitsubishi|lg.?thin|sensibo|tado/i;

const TV_VENDOR_RANK: Record<SmartDeviceVendor, number> = {
  roku: 40,
  chromecast: 30,
  android_tv: 25,
  airplay: 20,
  homekit_ac: 0,
  unknown: 0,
};

function pickPrimaryIp(addresses: string[] | undefined): string | null {
  if (!addresses?.length) return null;
  const v4 = addresses.find((a) => a.includes(".") && !a.startsWith("169.254."));
  return v4 ?? addresses[0] ?? null;
}

function baseDevice(
  svc: ZeroconfService,
  pairedIds: Set<string>,
  kind: SmartDeviceType,
  protocol: SmartDevice["protocol"],
  vendor: SmartDeviceVendor,
): SmartDevice | null {
  const ip = pickPrimaryIp(svc.addresses);
  if (!ip) return null;
  const id = `lan-${ip}`;
  const name = (svc.name || svc.host || "Device").replace(/\.local\.?$/i, "");
  return {
    id,
    name,
    type: kind,
    ip,
    protocol,
    vendor,
    paired: pairedIds.has(id),
  };
}

function betterTvDevice(a: SmartDevice, b: SmartDevice): SmartDevice {
  const ra = TV_VENDOR_RANK[a.vendor ?? "unknown"];
  const rb = TV_VENDOR_RANK[b.vendor ?? "unknown"];
  if (rb !== ra) return rb > ra ? b : a;
  return b.name.length >= a.name.length ? b : a;
}

const scanTargets: ScanTarget[] = [
  {
    serviceType: "roku",
    map: (svc, pairedIds) => baseDevice(svc, pairedIds, "smart_tv", "mdns", "roku"),
  },
  {
    serviceType: "googlecast",
    map: (svc, pairedIds) => baseDevice(svc, pairedIds, "smart_tv", "cast", "chromecast"),
  },
  {
    serviceType: "androidtvremote2",
    map: (svc, pairedIds) => baseDevice(svc, pairedIds, "smart_tv", "mdns", "android_tv"),
  },
  {
    serviceType: "airplay",
    map: (svc, pairedIds) => baseDevice(svc, pairedIds, "smart_tv", "mdns", "airplay"),
  },
  {
    serviceType: "hap",
    map: (svc, pairedIds) => {
      const name = svc.name || "";
      if (!acNameHint.test(name)) return null;
      return baseDevice(svc, pairedIds, "smart_ac", "mdns", "homekit_ac");
    },
  },
];

let zeroconfSingleton: Zeroconf | null = null;

function getZeroconf(): Zeroconf {
  if (!zeroconfSingleton) zeroconfSingleton = new Zeroconf();
  return zeroconfSingleton;
}

function mergeDevice(map: Map<string, SmartDevice>, device: SmartDevice, onDevice?: (d: SmartDevice) => void) {
  const prev = map.get(device.id);

  if (!prev) {
    map.set(device.id, device);
    onDevice?.(device);
    return;
  }

  if (prev.type === "smart_tv" && device.type === "smart_tv") {
    const best = betterTvDevice(prev, device);
    const changed =
      best.vendor !== prev.vendor || best.name !== prev.name || best.protocol !== prev.protocol;
    if (changed) {
      map.set(device.id, best);
      onDevice?.(best);
    }
    return;
  }

  if (prev.type === "smart_ac" && device.type === "smart_tv") {
    return;
  }
  if (prev.type === "smart_tv" && device.type === "smart_ac") {
    map.set(device.id, device);
    onDevice?.(device);
    return;
  }
  if (device.name.length > prev.name.length) {
    map.set(device.id, device);
    onDevice?.(device);
  }
}

export type MdnsDiscoverOptions = {
  pairedIds: Set<string>;
  onDevice?: (device: SmartDevice) => void;
};

export async function discoverLanDevices(options: MdnsDiscoverOptions): Promise<SmartDevice[]> {
  if (Platform.OS === "web" || !RNZeroconf) {
    return [];
  }

  const merged = new Map<string, SmartDevice>();
  const z = getZeroconf();

  const onError = (err: Error) => {
    console.warn("[mdnsDiscovery]", err.message);
  };
  z.on("error", onError);

  try {
    for (const target of scanTargets) {
      const onResolved = (svc: ZeroconfService) => {
        const device = target.map(svc, options.pairedIds);
        if (device) mergeDevice(merged, device, options.onDevice);
      };
      z.on("resolved", onResolved);

      if (Platform.OS === "android") {
        z.scan(target.serviceType, "tcp", "local.", ImplType.DNSSD);
      } else {
        z.scan(target.serviceType, "tcp", "local.");
      }

      await delay(SCAN_MS_PER_TYPE);

      if (Platform.OS === "android") {
        z.stop(ImplType.DNSSD);
      } else {
        z.stop();
      }

      z.removeListener("resolved", onResolved);
      await delay(GAP_AFTER_STOP_MS);
    }
  } finally {
    z.removeListener("error", onError);
  }

  const list = Array.from(merged.values());
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

export function isNativeDiscoveryAvailable(): boolean {
  return Platform.OS !== "web" && !!RNZeroconf;
}
