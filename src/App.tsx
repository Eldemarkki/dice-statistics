import { Alert, Button, List, NumberInput, Space } from '@mantine/core';
import React, { useState } from 'react';
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

interface Dice {
  id: string,
  sideCount: number
}

interface DiceControlPanelProps {
  dices: Dice[],
  setDices: (newDices: Dice[]) => void
}

const createDie = (sideCount: number): Dice => ({
  id: uuid(),
  sideCount
})

const AddDiceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`

const DicePresetsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  gap: 10px;
`

const DiceLabel = styled.span`
  display: inline-block;
  min-width: 50px;
`

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`

const DiceListHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const DiceControlPanelContainer = styled.div`
  max-width: 320px;
`;

const DiceListItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DiceList = styled(List)`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const DiceControlPanel = ({ dices, setDices }: DiceControlPanelProps) => {
  const [sideCount, setSideCount] = useState(6);

  const addDice = (sides: number) => {
    setDices([...dices, createDie(sides)]);
  }

  const deleteDice = (id: string) => {
    setDices(dices.filter(d => d.id !== id));
  }

  const dicePresets = [4, 6, 8, 10, 12, 20]
  const sideProduct = dices.reduce((p, d) => p * d.sideCount, 1);

  return <DiceControlPanelContainer>
    <h2>Add dice</h2>
    <AddDiceContainer>
      <NumberInput value={sideCount} onChange={val => setSideCount(val || 6)} min={1} />
      <Button onClick={() => addDice(sideCount)}>Add</Button>
    </AddDiceContainer>
    <DicePresetsContainer>
      {dicePresets.map(preset => <Button onClick={() => addDice(preset)} color="green" size="xs" key={preset}>d{preset}</Button>)}
    </DicePresetsContainer>
    {sideProduct >= 20 * 20 * 20 * 20 && <Alert icon="⚠️" title="That's a lot of dice" color="red">Adding more dice may slow the website down</Alert>}
    <Space />
    {dices.length !== 0 && <DiceListHeader>
      <h2>Dices</h2>
      <Button onClick={() => setDices([])} size="xs">Remove all</Button>
    </DiceListHeader>}
    <DiceList spacing={5}>
      {dices.map(d => {
        return <List.Item key={d.id}>
          <DiceListItem>
            <DiceLabel>d{d.sideCount}</DiceLabel>
            <Button color="red" size="xs" onClick={() => deleteDice(d.id)}>Delete</Button>
          </DiceListItem>
        </List.Item>
      })}
    </DiceList>
    <Space />
    <Alert color="gray">
      I take no responsibility for the correctness of this website
    </Alert>
  </DiceControlPanelContainer>
}

interface DiceStatisticsProps {
  dices: number[]
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DiceStatisticsContainer = styled.div`
  flex-grow: 1
`;

const nestedLoop = (_r: number[], f: (nums: number[]) => any, a: number[] = []) => {
  const r = [..._r]
  if (r.length > 0) {
    const end = r.shift() || 0;
    for (let v = 1; v <= end; v++) nestedLoop(r, f, a.concat(v));
  } else f(a)
}

const calculateProbabilities = (dices: number[]) => {
  const total = dices.reduce((p, d) => p * d, 1);

  const sumTable: { [key: number]: number } = {};

  nestedLoop(dices, (nums => {
    const s = nums.reduce((p, v) => p + v, 0);
    sumTable[s] = ((sumTable[s] || 0) * total + 1) / total;
  }))

  return sumTable;
}

const DiceStatistics = ({ dices }: DiceStatisticsProps) => {
  const sumTable = calculateProbabilities(dices)
  const labels = Object.keys(sumTable)

  const options = { responsive: true };

  const diceData = dices.length === 0 ? [] : Object.values(sumTable);

  const data: ChartData<"bar", number[], unknown> = {
    labels,
    datasets: [
      {
        label: "",
        data: diceData,
        backgroundColor: "red"
      }
    ]
  }

  return <DiceStatisticsContainer>
    <Bar options={{ ...options }} data={data} />
  </DiceStatisticsContainer>
}

const App = () => {
  const [dices, setDices] = useState<Dice[]>([]);

  return (
    <AppContainer>
      <DiceControlPanel dices={dices} setDices={setDices} />
      <DiceStatistics dices={dices.map(d => d.sideCount)} />
    </AppContainer>
  );
}

export default App;
