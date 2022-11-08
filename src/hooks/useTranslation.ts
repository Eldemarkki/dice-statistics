import { englishData, finnishData, TranslationResource } from "../localization/localizationData";
import { useLanguage } from "./useLanguage";

export type Language = "en" | "fi";

export const languageResources = {
  en: englishData,
  fi: finnishData
};


export const useTranslation = () => {
  const { language } = useLanguage();
  return (key: keyof TranslationResource, overrideLanguage?: Language) => languageResources[overrideLanguage ?? language][key]
}
