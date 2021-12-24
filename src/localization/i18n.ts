import i18n, { Resource } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { englishData, finnishData, TranslationResource } from "./localizationData";

export const languageResources: { [key: string]: TranslationResource } = {
  en: englishData,
  fi: finnishData
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: languageResources as unknown as Resource,
    fallbackLng: "en",
    supportedLngs: Object.keys(languageResources),
  });

export default i18n;