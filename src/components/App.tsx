import { MantineProvider } from '@mantine/core';
import { useColorScheme, useLocalStorageValue } from '@mantine/hooks';
import React, { useState } from 'react';
import styled from "styled-components";
import { ColorScheme } from '../data/ColorScheme';

import Dice from '../data/Dice';
import { ColorSchemeContext } from './contexts/ColorSchemeContext';
import { DiceControlPanel } from './DiceControlPanel';
import { DiceStatistics } from './DiceStatistics';

interface AppContainerProps {
  colorScheme: "dark" | "light"
}
const AppContainer = styled.div<AppContainerProps>`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: ${props => props.colorScheme === "dark" ? "#1A1B1E" : "white"};
`

export const App = () => {
  const [dices, setDices] = useState<Dice[]>([]);

  const preferredColorScheme = useColorScheme();
  const [colorSchemeFromLocalStorage, setColorSchemeToLocalStorage] = useLocalStorageValue<ColorScheme>({ key: "colorScheme", defaultValue: preferredColorScheme })
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
    <MantineProvider theme={{ colorScheme: actualColorScheme }}>
      <ColorSchemeContext.Provider value={colorSchemeValue}>
        <AppContainer colorScheme={actualColorScheme}>
          <DiceControlPanel dices={dices} setDices={setDices} />
          <DiceStatistics dices={dices.map(d => d.sideCount)} />
        </AppContainer>
      </ColorSchemeContext.Provider>
    </MantineProvider>
  );
}
