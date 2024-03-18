import {
	type ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { App } from "./components/App";
import LanguageContext from "./contexts/LanguageContext";
import type { Language } from "./hooks/useTranslation";

export const ApplicationSetup = () => {
	const preferredColorScheme = useColorScheme();
	const [colorSchemeFromLocalStorage, setColorSchemeToLocalStorage] =
		useLocalStorage<ColorScheme | undefined>({
			key: "colorScheme",
			defaultValue: undefined,
		});

	const actualColorScheme = colorSchemeFromLocalStorage || preferredColorScheme;

	const [language, setLanguage] = useLocalStorage<Language | undefined>({
		key: "language",
		defaultValue: undefined,
	});

	const navigatorLanguage = navigator.language.split("-")[0];
	const preferredLanguage = ["en", "fi"].includes(navigatorLanguage)
		? (navigatorLanguage as Language)
		: "en";
	const actualLanguage = language || preferredLanguage;

	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: actualColorScheme,
			}}
		>
			<LanguageContext.Provider
				value={{
					language: actualLanguage,
					setLanguage,
				}}
			>
				<ColorSchemeProvider
					colorScheme={actualColorScheme}
					toggleColorScheme={(newTheme) => {
						if (newTheme) {
							setColorSchemeToLocalStorage(newTheme);
						} else {
							setColorSchemeToLocalStorage(
								actualColorScheme === "dark" ? "light" : "dark",
							);
						}
					}}
				>
					<App />
				</ColorSchemeProvider>
			</LanguageContext.Provider>
		</MantineProvider>
	);
};
