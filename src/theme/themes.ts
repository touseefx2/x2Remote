export type Theme = {
  background: string;
  text: string;
  primary: string;
  borderLine: string;
  icon: string;
  card: string;
  shadow: string;
};

export const themes: Record<"light" | "dark" | "blue", Theme> = {
  light: {
    background: "#FFFFFF",
    text: "#111111",
    primary: "#365AB8",
    borderLine: "#D1D5DB",
    icon: "#111111",
    card: "#F8FAFC",
    shadow: "#000000",
  },
  dark: {
    background: "#0F172A",
    text: "#F8FAFC",
    primary: "#60A5FA",
    borderLine: "#334155",
    icon: "#F8FAFC",
    card: "#111827",
    shadow: "#000000",
  },
  blue: {
    background: "#EFF6FF",
    text: "#0B1F44",
    primary: "#1D4ED8",
    borderLine: "#93C5FD",
    icon: "#0B1F44",
    card: "#DBEAFE",
    shadow: "#000000",
  },
};

export type ThemeName = keyof typeof themes;
