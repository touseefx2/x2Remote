import * as Device from "expo-device";
import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;
const TABLET_MIN_DIMENSION = 768;

const SHORT_SIDE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
const LONG_SIDE = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT);
const IS_TABLET = SHORT_SIDE >= TABLET_MIN_DIMENSION;
const IS_LARGE_TABLET = IS_TABLET && LONG_SIDE >= 1200;

type ScaleKey =
  | "width"
  | "height"
  | "moderateWidth"
  | "moderateHeight"
  | "font";
type ScaleProfile = "phone" | "tablet";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getProfile = (): ScaleProfile => (IS_TABLET ? "tablet" : "phone");

const INTENSITY: Record<ScaleProfile, Record<ScaleKey, number>> = {
  phone: {
    width: 0.4,
    height: 0.35,
    moderateWidth: 0.3,
    moderateHeight: 0.28,
    font: 0.24,
  },
  tablet: {
    width: 0.32,
    height: 0.3,
    moderateWidth: 0.28,
    moderateHeight: 0.26,
    font: 0.24,
  },
};

const LIMITS: Record<ScaleProfile, Record<ScaleKey, [number, number]>> = {
  phone: {
    width: [0.94, 1.08],
    height: [0.94, 1.06],
    moderateWidth: [0.96, 1.05],
    moderateHeight: [0.96, 1.04],
    font: [0.96, 1.05],
  },
  tablet: {
    width: [1.04, 1.22],
    height: [1.04, 1.18],
    moderateWidth: [1.04, 1.14],
    moderateHeight: [1.04, 1.12],
    font: [1.06, 1.16],
  },
};

const WEB_MULTIPLIERS: Record<ScaleKey, [number, number, number]> = {
  width: [1, 1.08, 1.12],
  height: [1, 1.06, 1.1],
  moderateWidth: [1, 1.04, 1.06],
  moderateHeight: [1, 1.03, 1.05],
  font: [1, 1.05, 1.08],
};

const getWebBucket = (): 0 | 1 | 2 => {
  if (SCREEN_WIDTH <= 640) return 0;
  if (SCREEN_WIDTH <= 1024) return 1;
  return 2;
};

const getBaseRatio = (key: ScaleKey): number => {
  switch (key) {
    case "height":
    case "moderateHeight":
      return SCREEN_HEIGHT / BASE_HEIGHT;
    case "font":
      return SHORT_SIDE / BASE_WIDTH;
    case "width":
    case "moderateWidth":
    default:
      return SCREEN_WIDTH / BASE_WIDTH;
  }
};

const getFontAdjustment = (): number => {
  if (!IS_TABLET) {
    return Platform.OS === "ios" ? 1 : 0.98;
  }

  const deviceType = Device.deviceType;
  const isReportedTablet = deviceType === Device.DeviceType.TABLET;

  if (!isReportedTablet && !IS_TABLET) {
    return Platform.OS === "ios" ? 1 : 0.98;
  }

  return IS_LARGE_TABLET ? 1.14 : 1.08;
};

const getIconAdjustment = (): number => {
  if (!IS_TABLET) {
    return 1;
  }

  const deviceType = Device.deviceType;
  const isReportedTablet = deviceType === Device.DeviceType.TABLET;

  if (!isReportedTablet && !IS_TABLET) {
    return 1;
  }

  return IS_LARGE_TABLET ? 1.22 : 1.14;
};

const getMultiplier = (key: ScaleKey): number => {
  if (Platform.OS === "web") {
    const bucket = getWebBucket();
    return WEB_MULTIPLIERS[key][bucket];
  }

  const profile = getProfile();
  const rawRatio = getBaseRatio(key);
  const intensity = INTENSITY[profile][key];
  const [minLimit, maxLimit] = LIMITS[profile][key];

  const dampedRatio = 1 + (rawRatio - 1) * intensity;
  return clamp(dampedRatio, minLimit, maxLimit);
};

export const widthScale = (size: number): number => {
  return Math.round(size * getMultiplier("width"));
};

export const heightScale = (size: number): number => {
  return Math.round(size * getMultiplier("height"));
};

export const moderateWidthScale = (size: number, factor = 0.5): number => {
  const safeFactor = clamp(factor, 0, 1);
  const multiplier = getMultiplier("moderateWidth");
  const adjusted = 1 + (multiplier - 1) * safeFactor;
  return Math.round(size * adjusted);
};

export const moderateHeightScale = (size: number, factor = 0.5): number => {
  const safeFactor = clamp(factor, 0, 1);
  const multiplier = getMultiplier("moderateHeight");
  const adjusted = 1 + (multiplier - 1) * safeFactor;
  return Math.round(size * adjusted);
};

export const fontScale = (size: number): number => {
  const scaledSize = size * getMultiplier("font") * getFontAdjustment();
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

export const iconScale = (size: number): number => {
  const scaledSize = size * getMultiplier("moderateWidth") * getIconAdjustment();
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

export const responsiveMetrics = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  shortSide: SHORT_SIDE,
  longSide: LONG_SIDE,
  isTablet: IS_TABLET,
  isLargeTablet: IS_LARGE_TABLET,
} as const;
