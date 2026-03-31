import en from "@/src/i18n/locales/en.json";
import es from "@/src/i18n/locales/es.json";
import ur from "@/src/i18n/locales/ur.json";

export type AppLanguage = "en" | "ur" | "es";

type TranslationKeys = "screenTitle" | "screenSubtitle" | "language" | "theme";
type TranslationMap = Record<TranslationKeys, string>;

export const languageLabels: Record<AppLanguage, string> = {
  en: "English",
  ur: "Urdu",
  es: "Spanish",
};

export const translations: Record<AppLanguage, TranslationMap> = {
  en: en as TranslationMap,
  ur: ur as TranslationMap,
  es: es as TranslationMap,
};
