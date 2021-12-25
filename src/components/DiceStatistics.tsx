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
import { useTranslation } from 'react-i18next';
import { sign } from 'crypto';

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
	flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 10px;
`;

// Thanks to Antti (https://github.com/Chicken) for the initial implementation of this magic function!
const calculateCombinationSums = (array: number[], f: (sum: number) => void, sumSoFar = 0) => {
  const r = [...array]
  if (r.length > 0) {
    const end = r.shift() || 0;
    for (let v = 1; v <= end; v++) calculateCombinationSums(r, f, sumSoFar + v);
  }
  else f(sumSoFar)
}

const factorial = (n: number) => {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result
}

const choose = (n: number, k: number) => {
  return factorial(n) / (factorial(k) * factorial(n - k))
}

const calculateProbabilities = (dices: number[]): { [key: number]: number } => {
  const areAllSame = dices.every(d => d === dices[0]);

  const sumTable: { [key: number]: number } = {};
  if (areAllSame) {
    // https://www.lucamoroni.it/the-dice-roll-sum-problem/
    const min = dices.length;
    const max = dices.reduce((p, d) => p + d, 0);
    const n = dices.length;
    const s = dices[0]
    const total = Math.pow(s, n)
    for (let p = min; p <= max; p++) {
      let sum = 0;
      const kmax = Math.floor((p - n) / s)
      for (let k = 0; k <= kmax; k++) {
        sum += Math.pow(-1, k) * choose(n, k) * choose(p - s * k - 1, p - s * k - n);
      }
      sumTable[p] = sum / total;
    }
    return sumTable
  }
  else {
    calculateCombinationSums(dices, (sum => {
      sumTable[sum] = (sumTable[sum] || 0) + 1
    }))

    const total = dices.reduce((p, d) => p * d, 1);
    return Object.keys(sumTable).reduce((prev, key) => ({
      ...prev,
      [key]: sumTable[Number(key)] / total
    }), {});
  }
}

const roundToHalfPercent = (num: number | string) => Math.round(Number(num) * 100 * 2) / 2

export const DiceStatistics = ({ dices }: DiceStatisticsProps) => {
  const sumTable = calculateProbabilities(dices)
  const labels = Object.keys(sumTable)
  const { t } = useTranslation();

  const diceData = dices.length === 0 ? [] : Object.values(sumTable);

  const data: ChartData<"bar", number[], unknown> = {
    labels,
    datasets: [
      {
        label: "",
        data: diceData,
        backgroundColor: "#eb4034"
      }
    ]
  }

  return <DiceStatisticsContainer>
    <Bar
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (vals) => `${t("sum")}: ${vals[0].label}`,
              label: (vals) => `${Math.round(Number(vals.raw) * 100 * 1000) / 1000}%`
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