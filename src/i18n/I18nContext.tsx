import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { I18nManager, Platform } from "react-native";
import {
  languageLabels,
  translations,
  type AppLanguage,
} from "@/src/i18n/translations";

type TranslationKey = keyof (typeof translations)["en"];

type I18nContextValue = {
  language: AppLanguage;
  hydrated: boolean;
  isRTL: boolean;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  labelFor: (language: AppLanguage) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const LANGUAGE_STORAGE_KEY = "app_language";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [hydrated, setHydrated] = useState(false);
  const getIsRTL = (lang: AppLanguage): boolean => lang === "ur";

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === "en" || stored === "ur" || stored === "es") {
          setLanguage(stored);
          if (Platform.OS !== "web") {
            const wantRTL = getIsRTL(stored);
            if (I18nManager.isRTL !== wantRTL) {
              I18nManager.allowRTL(wantRTL);
              I18nManager.forceRTL(wantRTL);
            }
          }
        }
      } finally {
        setHydrated(true);
      }
    };

    void hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [hydrated, language]);

  const setLanguageWithDirection = useCallback((nextLanguage: AppLanguage) => {
    setLanguage(nextLanguage);

    if (Platform.OS === "web") return;

    const nextRTL = getIsRTL(nextLanguage);
    if (I18nManager.isRTL !== nextRTL) {
      I18nManager.allowRTL(nextRTL);
      I18nManager.forceRTL(nextRTL);
    }
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      hydrated,
      isRTL: getIsRTL(language),
      setLanguage: setLanguageWithDirection,
      t: (key) => translations[language][key],
      labelFor: (lang) => languageLabels[lang],
    };
  }, [hydrated, language, setLanguageWithDirection]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
};
