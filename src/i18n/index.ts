import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "@/i18n/locales/ar.json";
import en from "@/i18n/locales/en.json";

const STORAGE_KEY = "app-language";
const storedLanguage = localStorage.getItem(STORAGE_KEY);
const initialLanguage = storedLanguage === "en" ? "en" : "ar";

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false,
  },
});

export function setAppLanguage(language: "ar" | "en") {
  localStorage.setItem(STORAGE_KEY, language);
  i18n.changeLanguage(language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}

document.documentElement.lang = initialLanguage;
document.documentElement.dir = initialLanguage === "ar" ? "rtl" : "ltr";

export default i18n;
