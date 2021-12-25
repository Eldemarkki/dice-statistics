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

const factorial = (n: bigint) => {
  let result = BigInt(1);
  if (n <= 1) return result;

  for (let i = BigInt(1); i <= n; i++) {
    result *= i;
  }
  return result
}

const bigIntMin = (a: bigint, b: bigint) => a < b ? a : b
const bigIntMax = (a: bigint, b: bigint) => a > b ? a : b

const choose = (n: bigint, k: bigint) => {
  let result = BigInt(1);
  for (let i = bigIntMin(n, k) + BigInt(1); i <= bigIntMax(n, k); i++) {
    result *= i;
  }
  return result / factorial(n - k);
}

const calculateProbabilities = (dices: number[]): { [key: number]: number } => {
  if (dices.length === 0) return {};

  const areAllSame = dices.every(d => d === dices[0]);

  const sumTable: { [key: number]: number } = {};
  if (areAllSame) {
    // https://www.lucamoroni.it/the-dice-roll-sum-problem/
    const min = dices.length;
    const max = dices.reduce((p, d) => p + d, 0);
    const n = BigInt(dices.length);
    const s = BigInt(dices[0])
    const total = Math.pow(dices[0], dices.length)
    for (let p = BigInt(min); p <= BigInt(max); p++) {
      let sum = BigInt(0);
      const kmax = (p - n) / s
      for (let k = BigInt(0); k <= BigInt(kmax); k++) {
        const sign = k % BigInt(2) === BigInt(0) ? 1 : -1;
        sum += BigInt(sign) * choose(n, k) * choose(p - s * k - BigInt(1), p - s * k - n);
      }

      sumTable[Number(p)] = Math.max(Number(sum), 0) / total;
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
              label: (vals) => `${(Number(vals.raw) * 100).toFixed(3)}%`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (value, index, ticks) => `${(Number(value) * 100).toFixed(1)}%`
            }
          }
        }
      }}
      data={data} />
  </DiceStatisticsContainer>
}