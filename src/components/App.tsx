import { createStyles } from '@mantine/core';
import { useState } from 'react';

import Dice from '../data/Dice';
import { DiceControlPanel } from './DiceControlPanel';
import { DiceStatistics } from './DiceStatistics';

const useStyles = createStyles((theme) => ({
  appContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  }
}))

export const App = () => {
  const [dices, setDices] = useState<Dice[]>([]);
  const [diceModifier, setDiceModifier] = useState(0);

  const { classes } = useStyles();

  return (
    <div className={classes.appContainer}>
      <DiceControlPanel dices={dices} setDices={setDices} diceModifier={diceModifier} setDiceModifier={setDiceModifier} />
      <DiceStatistics dices={dices.map(d => d.sideCount)} diceModifier={diceModifier}/>
    </div>
  );
}
