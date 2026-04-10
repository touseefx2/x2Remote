export type Theme = {
  background: string;
  text: string;
  textOnPrimary: string;
  primary: string;
  borderLine: string;
  icon: string;
  card: string;
  shadow: string;
};

export const themes: Record<"light" | "dark" | "emerald", Theme> = {
  light: {
    background: "#FFFFFF",
    text: "#111111",
    textOnPrimary: "#FFFFFF",
    primary: "#365AB8",
    borderLine: "#D1D5DB",
    icon: "#111111",
    card: "#F8FAFC",
    shadow: "#000000",
  },
  dark: {
    background: "#000000",
    text: "#F8FAFC",
    textOnPrimary: "#FFFFFF",
    primary: "#60A5FA",
    borderLine: "#1F2937",
    icon: "#F8FAFC",
    card: "#0A0A0A",
    shadow: "#000000",
  },
  emerald: {
    background: "#001A14",
    text: "#F0FFF9",
    textOnPrimary: "#FFFFFF",
    primary: "#006B63",
    borderLine: "#0D3D36",
    icon: "#E6FFF7",
    card: "#002B24",
    shadow: "#000000",
  },
};

export type ThemeName = keyof typeof themes;
