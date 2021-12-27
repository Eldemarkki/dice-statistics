import { createContext } from "react";
import { ColorScheme } from "../data/ColorScheme";

interface ColorSchemeContextInterface {
	verboseTheme: ColorScheme,
	theme: "dark" | "light",
	setTheme: (newTheme: ColorScheme) => void
};

export const ColorSchemeContext = createContext<ColorSchemeContextInterface>({
	verboseTheme: "system",
	theme: "light",
	setTheme: () => {}
});