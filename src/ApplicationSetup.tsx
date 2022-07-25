import { MantineProvider } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import React, { useState } from 'react';
import { App } from './components/App';
import { ColorSchemeContext } from './contexts/ColorSchemeContext';
import { ColorScheme } from './data/ColorScheme';

export const AppplicationSetup = () => {
  const preferredColorScheme = useColorScheme();
  const [colorSchemeFromLocalStorage, setColorSchemeToLocalStorage] = useLocalStorage<ColorScheme>({
    key: "colorScheme",
    defaultValue: preferredColorScheme
  })
  const [colorScheme, setColorScheme] = useState(colorSchemeFromLocalStorage);
  const actualColorScheme = colorScheme === "system" ? preferredColorScheme : colorScheme;

  const setTheme = (newTheme: ColorScheme) => {
    setColorScheme(newTheme);
    setColorSchemeToLocalStorage(newTheme)
  }

  const colorSchemeValue = {
    verboseTheme: colorScheme,
    theme: actualColorScheme,
    setTheme
  }

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: actualColorScheme }}
    >
      <ColorSchemeContext.Provider value={colorSchemeValue}>
        <App />
      </ColorSchemeContext.Provider>
    </MantineProvider>
  );
}
