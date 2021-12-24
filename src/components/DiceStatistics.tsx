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
import styled from 'styled-components';

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

// Thanks to Antti (https://github.com/Chicken) for this magic function!
const nestedLoop = (_r: number[], f: (nums: number[]) => any, a: number[] = []) => {
  const r = [..._r]
  if (r.length > 0) {
    const end = r.shift() || 0;
    for (let v = 1; v <= end; v++) nestedLoop(r, f, a.concat(v));
  } else f(a)
}

const roundToHalfPercent = (num: number | string) => Math.round(Number(num) * 100 * 2) / 2

const calculateProbabilities = (dices: number[]) => {
  const total = dices.reduce((p, d) => p * d, 1);

  const sumTable: { [key: number]: number } = {};

  nestedLoop(dices, (nums => {
    const s = nums.reduce((p, v) => p + v, 0);
    sumTable[s] = ((sumTable[s] || 0) * total + 1) / total;
  }))

  return sumTable;
}

export const DiceStatistics = ({ dices }: DiceStatisticsProps) => {
  const sumTable = calculateProbabilities(dices)
  const labels = Object.keys(sumTable)

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
    <Bar
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (vals) => `${Math.round(Number(vals[0].raw) * 100 * 1000) / 1000}%`,
              label: (vals) => `Sum: ${vals.dataIndex + dices.length}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (value, index, ticks) => `${roundToHalfPercent(value)}%`
            }
          }
        }
      }}
      data={data} />
  </DiceStatisticsContainer>
}