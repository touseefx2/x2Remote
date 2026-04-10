import { nec32Pattern, sirc12Pattern } from "@/src/services/irCodecs";

export type TvIrCommand = "power" | "volumeUp" | "volumeDown" | "channelUp" | "channelDown";

type Sirc = { addr: number; cmd: number };

/** NEC 32-bit codes (common community values; may vary by model/firmware). */
const samsungNec: Record<TvIrCommand, number> = {
  power: 0xe0e040bf,
  volumeUp: 0xe0e0e01f,
  volumeDown: 0xe0e0d02f,
  channelUp: 0xe0e048b7,
  channelDown: 0xe0e08877,
};

const lgNec: Record<TvIrCommand, number> = {
  power: 0x20df10ef,
  volumeUp: 0x20df40bf,
  volumeDown: 0x20dfc03f,
  channelUp: 0x20df00ff,
  channelDown: 0x20df807f,
};

const haierNec: Record<TvIrCommand, number> = {
  power: 0x00ff00ff,
  volumeUp: 0x00ff807f,
  volumeDown: 0x00ff40bf,
  channelUp: 0x00ffc03f,
  channelDown: 0x00ffa05f,
};

const panasonicNec: Record<TvIrCommand, number> = {
  power: 0x400405fc,
  volumeUp: 0x40040dfc,
  volumeDown: 0x400415ec,
  channelUp: 0x400434c7,
  channelDown: 0x400454a7,
};

const sonySirc: Record<TvIrCommand, Sirc> = {
  power: { addr: 1, cmd: 21 },
  volumeUp: { addr: 1, cmd: 18 },
  volumeDown: { addr: 1, cmd: 19 },
  channelUp: { addr: 1, cmd: 16 },
  channelDown: { addr: 1, cmd: 17 },
};

export function tvPatternForBrand(brandId: string, command: TvIrCommand): number[] {
  switch (brandId) {
    case "lg":
      return nec32Pattern(lgNec[command]);
    case "haier":
      return nec32Pattern(haierNec[command]);
    case "panasonic":
      return nec32Pattern(panasonicNec[command]);
    case "sony": {
      const s = sonySirc[command];
      return sirc12Pattern(s.cmd, s.addr);
    }
    case "samsung":
    default:
      return nec32Pattern(samsungNec[command]);
  }
}

export function tvCarrierHz(brandId: string): number {
  return brandId === "sony" ? 40000 : 38000;
}

export type AcIrCommand =
  | "power"
  | "tempUp"
  | "tempDown"
  | "fanSpeed"
  | "modeCool"
  | "modeHeat"
  | "modeFan";

/** Short demo AC frames (not full stateful AC protocols); real ACs often need long frames. */
const acNecByBrand: Record<string, Partial<Record<AcIrCommand, number>>> = {
  gree: {
    power: 0x08080000,
    tempUp: 0x08081000,
    tempDown: 0x08082000,
    fanSpeed: 0x08083000,
    modeCool: 0x08084000,
    modeHeat: 0x08085000,
    modeFan: 0x08086000,
  },
  haier: {
    power: 0x0a0a0000,
    tempUp: 0x0a0a1000,
    tempDown: 0x0a0a2000,
    fanSpeed: 0x0a0a3000,
    modeCool: 0x0a0a4000,
    modeHeat: 0x0a0a5000,
    modeFan: 0x0a0a6000,
  },
  samsung: {
    power: 0x0c0c0000,
    tempUp: 0x0c0c1000,
    tempDown: 0x0c0c2000,
    fanSpeed: 0x0c0c3000,
    modeCool: 0x0c0c4000,
    modeHeat: 0x0c0c5000,
    modeFan: 0x0c0c6000,
  },
  lg: {
    power: 0x0d0d0000,
    tempUp: 0x0d0d1000,
    tempDown: 0x0d0d2000,
    fanSpeed: 0x0d0d3000,
    modeCool: 0x0d0d4000,
    modeHeat: 0x0d0d5000,
    modeFan: 0x0d0d6000,
  },
  daikin: {
    power: 0x0e0e0000,
    tempUp: 0x0e0e1000,
    tempDown: 0x0e0e2000,
    fanSpeed: 0x0e0e3000,
    modeCool: 0x0e0e4000,
    modeHeat: 0x0e0e5000,
    modeFan: 0x0e0e6000,
  },
};

const acFallback: Record<AcIrCommand, number> = {
  power: 0x08080000,
  tempUp: 0x08081000,
  tempDown: 0x08082000,
  fanSpeed: 0x08083000,
  modeCool: 0x08084000,
  modeHeat: 0x08085000,
  modeFan: 0x08086000,
};

export function acPatternForBrand(brandId: string, command: AcIrCommand): number[] {
  const table = acNecByBrand[brandId];
  const code = table?.[command] ?? acFallback[command];
  return nec32Pattern(code);
}

export function acCarrierHz(_brandId: string): number {
  return 38000;
}
