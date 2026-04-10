declare module "react-native-zeroconf" {
  import type { EventEmitter } from "events";

  export const ImplType: {
    readonly NSD: "NSD";
    readonly DNSSD: "DNSSD";
  };

  type Service = {
    name: string;
    fullName?: string;
    host?: string;
    port?: number;
    addresses?: string[];
    txt?: Record<string, string>;
  };

  export default class Zeroconf extends EventEmitter {
    scan(
      type?: string,
      protocol?: string,
      domain?: string,
      implType?: (typeof ImplType)[keyof typeof ImplType],
    ): void;
    stop(implType?: (typeof ImplType)[keyof typeof ImplType]): void;
    getServices(): Record<string, Service>;
    removeDeviceListeners(): void;
    addDeviceListeners(): void;
  }
}
