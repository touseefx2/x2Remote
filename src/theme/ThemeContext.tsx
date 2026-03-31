import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { themes, type Theme, type ThemeName } from "@/src/theme/themes";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  themeName: ThemeName;
  mode: ThemeMode;
  colors: Theme;
  hydrated: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = "app_theme_name";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "blue") {
          setThemeName(stored);
        }
      } finally {
        setHydrated(true);
      }
    };

    void hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [hydrated, themeName]);

  const value = useMemo<ThemeContextValue>(() => {
    const mode: ThemeMode = themeName === "dark" ? "dark" : "light";

    return {
      themeName,
      mode,
      colors: themes[themeName],
      hydrated,
      setTheme: setThemeName,
      toggleMode: () => setThemeName((prev) => (prev === "dark" ? "light" : "dark")),
    };
  }, [hydrated, themeName]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useAppTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used inside ThemeProvider");
  }
  return ctx;
};
