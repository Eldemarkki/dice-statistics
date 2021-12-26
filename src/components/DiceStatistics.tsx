import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Center, Text, useMantineTheme } from '@mantine/core';

interface DiceStatisticsProps {
  dices: number[]
};

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
  const { t } = useTranslation();
  const theme = useMantineTheme()
  const data = Object.keys(sumTable).sort((a, b) => Number(a) - Number(b)).map(key => {
    return {
      name: key,
      sum: sumTable[Number(key)]
    }
  })

  if (dices.length === 0) {
    return <Center style={{ flexGrow: 1 }}>
      <Text>{t("noStatistics")}</Text>
    </Center>
  }

  return <DiceStatisticsContainer>
    <ResponsiveContainer>
      <BarChart data={data} height={500} width={500}>
        <XAxis dataKey="name" />
        <YAxis
          tickCount={10}
          unit={"%"}
          interval={0}
          tickFormatter={(value, index) => `${(Number(value) * 100).toFixed(1)}`} />
        <CartesianGrid vertical={false} />
        <Tooltip
          cursor={{
            fill: theme.fn.rgba(theme.colors.gray[theme.colorScheme === "dark" ? 5 : 4], 0.7)
          }}
          labelFormatter={(v) => `${t("sum")}: ${v}`}
          separator=''
          formatter={(value: number) => [`${(value * 100).toFixed(3)}%`, ""]} />
        <Bar dataKey="sum" fill={theme.colors.blue[theme.colorScheme === "dark" ? 8 : 6]} />
      </BarChart>
    </ResponsiveContainer>
  </DiceStatisticsContainer>
}