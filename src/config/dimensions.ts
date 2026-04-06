// =============================
// RESPONSIVE SCALING SYSTEM
// Updated (Senior-Level Optimized)
// =============================

import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ✅ Changed to industry standard
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const TABLET_MIN_DIMENSION = 768;

const SHORT_SIDE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
const LONG_SIDE = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT);

const IS_TABLET = SHORT_SIDE >= TABLET_MIN_DIMENSION;
const IS_LARGE_TABLET = IS_TABLET && LONG_SIDE >= 1200;
const IS_TV = LONG_SIDE >= 1400;

// ---------------- Types ----------------
type ScaleKey =
  | "width"
  | "height"
  | "moderateWidth"
  | "moderateHeight"
  | "font";

type ScaleProfile = "phone" | "tablet";

// ---------------- Utils ----------------
const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getProfile = (): ScaleProfile => (IS_TABLET ? "tablet" : "phone");

// ---------------- Scaling Config ----------------
const INTENSITY: Record<ScaleProfile, Record<ScaleKey, number>> = {
  phone: {
    width: 0.4,
    height: 0.35,
    moderateWidth: 0.3,
    moderateHeight: 0.28,
    font: 0.22,
  },
  tablet: {
    width: 0.32,
    height: 0.3,
    moderateWidth: 0.28,
    moderateHeight: 0.26,
    font: 0.22,
  },
};

const LIMITS: Record<ScaleProfile, Record<ScaleKey, [number, number]>> = {
  phone: {
    width: [0.94, 1.08],
    height: [0.94, 1.06],
    moderateWidth: [0.96, 1.05],
    moderateHeight: [0.96, 1.04],
    font: [0.95, 1.04],
  },
  tablet: {
    width: [1.04, 1.22],
    height: [1.04, 1.18],
    moderateWidth: [1.04, 1.14],
    moderateHeight: [1.04, 1.12],
    font: [1.05, 1.14],
  },
};

// ---------------- Web Scaling ----------------
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

// ---------------- Core Logic ----------------
const getBaseRatio = (key: ScaleKey): number => {
  switch (key) {
    case "height":
    case "moderateHeight":
      return SCREEN_HEIGHT / BASE_HEIGHT;
    case "font":
      return SHORT_SIDE / BASE_WIDTH;
    default:
      return SCREEN_WIDTH / BASE_WIDTH;
  }
};

const getFontAdjustment = (): number => {
  if (!IS_TABLET) return Platform.OS === "ios" ? 1 : 0.98;
  return IS_LARGE_TABLET ? 1.12 : 1.06;
};

const getIconAdjustment = (): number => {
  if (!IS_TABLET) return 1;
  return IS_LARGE_TABLET ? 1.2 : 1.12;
};

const getMultiplier = (key: ScaleKey): number => {
  if (Platform.OS === "web") {
    return WEB_MULTIPLIERS[key][getWebBucket()];
  }

  const profile = getProfile();
  const rawRatio = getBaseRatio(key);
  const intensity = INTENSITY[profile][key];
  const [minLimit, maxLimit] = LIMITS[profile][key];

  const dampedRatio = 1 + (rawRatio - 1) * intensity;
  let result = clamp(dampedRatio, minLimit, maxLimit);

  // ✅ Extra boost for TV
  if (IS_TV) {
    result *= 1.15;
  }

  return result;
};

// ---------------- Exported Functions ----------------

// 🔴 Use for layout (width, margins, spacing)
export const widthScale = (size: number): number => {
  return Math.round(size * getMultiplier("width"));
};

// 🔴 Use for vertical sizing
export const heightScale = (size: number): number => {
  return Math.round(size * getMultiplier("height"));
};

// 🟡 Use for buttons, cards (soft scaling)
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

// 🟢 Use for text (SAFE scaling)
export const fontScale = (size: number): number => {
  const scaledSize = size * getMultiplier("font") * getFontAdjustment();
  return Math.max(12, Math.round(PixelRatio.roundToNearestPixel(scaledSize)));
};

// 🔵 Use for icons
export const iconScale = (size: number): number => {
  const scaledSize =
    size * getMultiplier("moderateWidth") * getIconAdjustment();
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

// ---------------- Device Info ----------------
export const responsiveMetrics = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  shortSide: SHORT_SIDE,
  longSide: LONG_SIDE,
  isTablet: IS_TABLET,
  isLargeTablet: IS_LARGE_TABLET,
  isTV: IS_TV,
} as const;

// =============================
// 🔥 USAGE GUIDE (CURSOR RULE FILE)
// =============================

/*
🔥 BEST USAGE GUIDE (IMPORTANT)

✅ ALWAYS FOLLOW THIS RULE:

❌ NEVER USE FIXED VALUES
fontSize: 14
width: 100

✅ ALWAYS USE SCALING:
fontSize: fontScale(14)
width: widthScale(100)

----------------------------------

📱 LAYOUT (Containers, spacing)
👉 Use widthScale / heightScale

width: widthScale(100)
margin: widthScale(12)

----------------------------------

🟡 BUTTONS / CARDS
👉 Use moderate scaling (soft UI)

padding: moderateWidthScale(12)
borderRadius: moderateWidthScale(8)

----------------------------------

🟢 TEXT (Typography)
👉 Always use fontScale

fontSize: fontScale(14)

----------------------------------

🔵 ICONS
👉 Use iconScale

size: iconScale(20)

----------------------------------

📱 TABLET HANDLING (IMPORTANT)

const isTablet = responsiveMetrics.isTablet;

flexDirection: isTablet ? 'row' : 'column'

----------------------------------

🖥️ LARGE SCREEN / TV

const isTV = responsiveMetrics.isTV;

fontSize: isTV ? fontScale(18) : fontScale(14)

⚠️ Note: TV override is optional.
Use it only when design/readability needs intentionally larger text.

----------------------------------

💡 GOLDEN RULE:

Layout (horizontal) → widthScale
Layout (vertical) → heightScale
UI elements → moderateWidthScale / moderateHeightScale
Text → fontScale
Icons → iconScale

----------------------------------

🚀 RESULT:

✔ Perfect on iPhone
✔ Perfect on Android
✔ Perfect on Tablet
✔ Perfect on iPad
✔ Works on Web
✔ Scales on TV

*/
