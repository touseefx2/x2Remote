export type DeviceCategory = "tv" | "ac";

export type RemoteMode = "ir" | "smart" | "universal";

export type ACMode = "cool" | "heat" | "fan";
export type FanSpeed = "auto" | "low" | "medium" | "high";

export type DeviceBrand = {
  id: string;
  name: string;
};

export type SmartDeviceType = "smart_tv" | "smart_ac";

export type SmartDevice = {
  id: string;
  name: string;
  type: SmartDeviceType;
  ip: string;
  protocol: "mdns" | "ssdp" | "cast" | "manual";
  paired: boolean;
};

export type PairingState = "idle" | "pairing" | "paired" | "failed";

export type IRCapability = {
  supported: boolean;
  message?: string;
  platform: "android" | "ios" | "other";
  mockMode: boolean;
};
