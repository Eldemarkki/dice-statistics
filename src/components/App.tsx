import { MantineProvider } from '@mantine/core';
import { useColorScheme, useLocalStorageValue } from '@mantine/hooks';
import React, { useState } from 'react';
import styled from "styled-components";

import Dice from '../data/Dice';
import { DiceControlPanel } from './DiceControlPanel';
import { DiceStatistics } from './DiceStatistics';

interface AppContainerProps {
  colorScheme: "dark" | "light"
}
const AppContainer = styled.div<AppContainerProps>`
  display: flex;
  flex-direction: row;
  gap: 30px;
  height: 100vh;
  background-color: ${props => props.colorScheme === "dark" ? "#0a0b15" : "white"};
`

export const App = () => {
  const [dices, setDices] = useState<Dice[]>([]);

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorageValue({ key: "colorScheme", defaultValue: preferredColorScheme })

  return (
    <MantineProvider theme={{ colorScheme }}>
      <AppContainer colorScheme={colorScheme}>
        <DiceControlPanel dices={dices} setDices={setDices} colorScheme={colorScheme} toggleColorScheme={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")} />
        <DiceStatistics dices={dices.map(d => d.sideCount)} />
      </AppContainer>
    </MantineProvider>
  );
}
