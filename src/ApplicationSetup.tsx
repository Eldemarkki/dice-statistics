import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { App } from './components/App';

export const ApplicationSetup = () => {
  const preferredColorScheme = useColorScheme();
  const [colorSchemeFromLocalStorage, setColorSchemeToLocalStorage] = useLocalStorage<ColorScheme | undefined>({
    key: "colorScheme",
    defaultValue: undefined
  })

  const actualColorScheme = colorSchemeFromLocalStorage || preferredColorScheme;

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: actualColorScheme,
      }}
    >
      <ColorSchemeProvider colorScheme={actualColorScheme} toggleColorScheme={(newTheme) => {
        if (newTheme) {
          setColorSchemeToLocalStorage(newTheme);
        }
        else {
          setColorSchemeToLocalStorage(actualColorScheme === "dark" ? "light" : "dark");
        }
      }}>
        <App />
      </ColorSchemeProvider>
    </MantineProvider>
  );
}
