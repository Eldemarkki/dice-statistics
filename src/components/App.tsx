import React, { useState } from 'react';
import styled from "styled-components";

import Dice from '../data/Dice';
import { DiceControlPanel } from './DiceControlPanel';
import { DiceStatistics } from './DiceStatistics';

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`

export const App = () => {
  const [dices, setDices] = useState<Dice[]>([]);
  return (
    <AppContainer>
      <DiceControlPanel dices={dices} setDices={setDices} />
      <DiceStatistics dices={dices.map(d => d.sideCount)} />
    </AppContainer>
  );
}
