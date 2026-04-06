import {
  languageLabels,
  translations,
  type AppLanguage,
} from "@/src/i18n/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
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

type TranslationKey = keyof (typeof translations)["en"];

type I18nContextValue = {
  language: AppLanguage;
  hydrated: boolean;
  isRTL: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: TranslationKey) => string;
  labelFor: (language: AppLanguage) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const LANGUAGE_STORAGE_KEY = "app_language";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [hydrated, setHydrated] = useState(false);
  const getIsRTL = (lang: AppLanguage): boolean => lang === "ur";
  const applyLanguageDirection = useCallback((lang: AppLanguage): boolean => {
    if (Platform.OS === "web") return false;

    const wantRTL = getIsRTL(lang);
    if (I18nManager.isRTL === wantRTL) return false;

    I18nManager.allowRTL(wantRTL);
    I18nManager.forceRTL(wantRTL);
    return true;
  }, []);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === "en" || stored === "ur" || stored === "es") {
          setLanguage(stored);
          applyLanguageDirection(stored);
        }
      } finally {
        setHydrated(true);
      }
    };

    void hydrate();
  }, [applyLanguageDirection]);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [hydrated, language]);

  const setLanguageWithDirection = useCallback(
    async (nextLanguage: AppLanguage) => {
      if (nextLanguage === language) return;

      setLanguage(nextLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);

      const directionChanged = applyLanguageDirection(nextLanguage);
      if (directionChanged) {
        try {
          await Updates.reloadAsync();
        } catch {
          // Keep language persisted even if runtime reload is unavailable.
        }
      }
    },
    [applyLanguageDirection, language],
  );

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
