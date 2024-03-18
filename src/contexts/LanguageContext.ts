import { createContext } from "react";
import type { Language } from "../hooks/useTranslation";

interface LanguageContextInterface {
	language: Language;
	setLanguage: (language: Language) => void;
}

export default createContext<LanguageContextInterface>({
	language: "en",
	setLanguage: () => console.log("No language provider"),
});
