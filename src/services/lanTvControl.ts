import type { SmartDevice, SmartDeviceVendor } from "@/src/types/remote";

export type TvCommand = "power" | "volumeUp" | "volumeDown" | "navUp" | "navDown" | "appYoutube";

const FETCH_TIMEOUT_MS = 8000;

const ipVendorCache = new Map<string, SmartDeviceVendor>();

function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(id));
}

/** Roku ECP requires Host to match the device IP or it may return 403. */
async function rokuRequest(ip: string, path: string, method: "GET" | "POST" = "POST"): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`http://${ip}:8060${path}`, {
      method,
      headers: { Host: ip },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function probeRoku(ip: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`http://${ip}:8060/query/device-info`, {
      method: "GET",
      headers: { Host: ip },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function probeCast(ip: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`http://${ip}:8008/setup/eureka_info`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

async function resolveControlVendor(ip: string, hint?: SmartDeviceVendor): Promise<SmartDeviceVendor> {
  if (hint && hint !== "unknown") {
    ipVendorCache.set(ip, hint);
    return hint;
  }
  const cached = ipVendorCache.get(ip);
  if (cached && cached !== "unknown") return cached;

  if (await probeRoku(ip)) {
    ipVendorCache.set(ip, "roku");
    return "roku";
  }
  if (await probeCast(ip)) {
    ipVendorCache.set(ip, "chromecast");
    return "chromecast";
  }
  return "unknown";
}

export function resolveSmartDeviceVendor(device: SmartDevice): SmartDeviceVendor {
  if (device.vendor && device.vendor !== "unknown") return device.vendor;
  if (device.protocol === "cast") return "chromecast";
  if (/roku/i.test(device.name)) return "roku";
  return "unknown";
}

const rokuKeys: Record<TvCommand, string | null> = {
  power: "Power",
  volumeUp: "VolumeUp",
  volumeDown: "VolumeDown",
  navUp: "Up",
  navDown: "Down",
  appYoutube: null,
};

async function sendRokuCommand(ip: string, command: TvCommand): Promise<boolean> {
  if (command === "appYoutube") {
    return rokuRequest(ip, "/launch/837", "POST");
  }
  const key = rokuKeys[command];
  if (!key) return false;
  return rokuRequest(ip, `/keypress/${key}`, "POST");
}

/** DIAL-style launch on Chromecast / Google Cast built-in (port 8008). */
async function chromecastLaunchYouTube(ip: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`http://${ip}:8008/apps/YouTube`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Host: ip },
      body: "{}",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendLanTvCommand(
  device: SmartDevice,
  command: TvCommand,
): Promise<boolean> {
  const ip = device.ip.trim();
  if (!ip) return false;

  let vendor = resolveSmartDeviceVendor(device);
  if (vendor === "unknown" && device.type === "smart_tv") {
    vendor = await resolveControlVendor(ip, undefined);
  }

  switch (vendor) {
    case "roku":
      return sendRokuCommand(ip, command);
    case "chromecast":
    case "android_tv":
      if (command === "appYoutube") {
        return chromecastLaunchYouTube(ip);
      }
      return false;
    case "airplay":
      return false;
    default:
      return false;
  }
}
