export type DeviceCategory = "tv" | "ac";

export type RemoteMode = "ir" | "smart" | "universal";

export type ACMode = "cool" | "heat" | "fan";
export type FanSpeed = "auto" | "low" | "medium" | "high";

export type DeviceBrand = {
  id: string;
  name: string;
};

export type SmartDeviceType = "smart_tv" | "smart_ac";

/** How we send LAN commands (from mDNS service / fallback detection). */
export type SmartDeviceVendor =
  | "roku"
  | "chromecast"
  | "android_tv"
  | "airplay"
  | "homekit_ac"
  | "unknown";

export type SmartDevice = {
  id: string;
  name: string;
  type: SmartDeviceType;
  ip: string;
  protocol: "mdns" | "ssdp" | "cast" | "manual";
  paired: boolean;
  /** Set by discovery; older saved devices may omit (we probe at command time). */
  vendor?: SmartDeviceVendor;
};

export type PairingState = "idle" | "pairing" | "paired" | "failed";

export type IRCapability = {
  supported: boolean;
  message?: string;
  platform: "android" | "ios" | "other";
  mockMode: boolean;
};
