import { Center, Text, useMantineTheme } from "@mantine/core";
import { BarElement, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import { useTranslation } from "../hooks/useTranslation";

ChartJS.register(BarElement, LinearScale, Tooltip);

interface DiceStatisticsProps {
	dices: number[];
	diceModifier: number;
}

const DiceStatisticsContainer = styled.div`
	flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 10px;
  overflow: hidden;
`;

// Thanks to Antti (https://github.com/Chicken) for the initial implementation of this magic function!
const calculateCombinationSums = (
	array: number[],
	f: (sum: number) => void,
	sumSoFar = 0,
) => {
	const r = [...array];
	if (r.length > 0) {
		const end = r.shift() || 0;
		for (let v = 1; v <= end; v++) calculateCombinationSums(r, f, sumSoFar + v);
	} else f(sumSoFar);
};

const factorial = (n: bigint) => {
	let result = BigInt(1);
	if (n <= 1) return result;

	for (let i = BigInt(1); i <= n; i++) {
		result *= i;
	}
	return result;
};

const bigIntMin = (a: bigint, b: bigint) => (a < b ? a : b);
const bigIntMax = (a: bigint, b: bigint) => (a > b ? a : b);

const choose = (n: bigint, k: bigint) => {
	let result = BigInt(1);
	for (let i = bigIntMin(n, k) + BigInt(1); i <= bigIntMax(n, k); i++) {
		result *= i;
	}
	return result / factorial(n - k);
};

const calculateProbabilities = (dices: number[]): { [key: number]: number } => {
	if (dices.length === 0) return {};

	const areAllSame = dices.every((d) => d === dices[0]);

	const sumTable: { [key: number]: number } = {};
	if (areAllSame) {
		// https://www.lucamoroni.it/the-dice-roll-sum-problem/
		const min = dices.length;
		const max = dices.reduce((p, d) => p + d, 0);
		const n = BigInt(dices.length);
		const s = BigInt(dices[0]);
		const total = Math.pow(dices[0], dices.length);
		for (let p = BigInt(min); p <= BigInt(max); p++) {
			let sum = BigInt(0);
			const kmax = (p - n) / s;
			for (let k = BigInt(0); k <= BigInt(kmax); k++) {
				const sign = k % BigInt(2) === BigInt(0) ? 1 : -1;
				sum +=
					BigInt(sign) *
					choose(n, k) *
					choose(p - s * k - BigInt(1), p - s * k - n);
			}

			sumTable[Number(p)] = Math.max(Number(sum), 0) / total;
		}
		return sumTable;
	} else {
		calculateCombinationSums(dices, (sum) => {
			sumTable[sum] = (sumTable[sum] || 0) + 1;
		});

		const total = dices.reduce((p, d) => p * d, 1);
		return Object.keys(sumTable).reduce(
			(prev, key) => ({
				...prev,
				[key]: sumTable[Number(key)] / total,
			}),
			{},
		);
	}
};

export const DiceStatistics = ({
	dices,
	diceModifier,
}: DiceStatisticsProps) => {
	const sumTable = calculateProbabilities(dices);
	const t = useTranslation();
	const theme = useMantineTheme();
	const data = Object.keys(sumTable)
		.sort((a, b) => Number(a) - Number(b))
		.map((key) => {
			return {
				name: key,
				sum: sumTable[Number(key)],
			};
		});

	if (dices.length === 0) {
		return (
			<Center style={{ flexGrow: 1 }}>
				<Text>{t("noStatistics")}</Text>
			</Center>
		);
	}

	return (
		<DiceStatisticsContainer>
			<Bar
				data={{
					datasets: [
						{
							data: data.map((d) => d.sum),
							backgroundColor: theme.colors.blue[5],
						},
					],
					labels: data.map((d) => Number(d.name) + diceModifier),
				}}
				options={{
					maintainAspectRatio: false,
					responsive: true,
					plugins: {
						tooltip: {
							mode: "x",
							intersect: false,
							callbacks: {
								title(tooltipItems) {
									return `${t("sum")}: ${tooltipItems[0].label}`;
								},
								label(tooltipItems) {
									const probability = Number(tooltipItems.raw);
									return `${(probability * 100).toFixed(3)}%`;
								},
							},
							displayColors: false,
							titleFont: {
								size: 20,
							},
							bodyFont: {
								size: 18,
							},
							padding: 15,
						},
					},
					scales: {
						x: {
							type: "linear",
							ticks: {
								stepSize: 1,
							},
							grid: {
								color: theme.colors.gray[5],
							},
						},
						y: {
							type: "linear",
							grid: {
								color: theme.colors.gray[5],
							},
							ticks: {
								callback(tickValue, index, ticks) {
									return `${(Number(tickValue) * 100).toFixed(2)}%`;
								},
							},
						},
					},
				}}
			/>
			{/* <ResponsiveContainer>
      <BarChart data={data} height={500} width={500}>
        <XAxis dataKey="name"
          tickFormatter={(value) => String(Number(value) + diceModifier)}
        />
        <YAxis
          tickCount={10}
          unit={"%"}
          interval={0}
          tickFormatter={(value, index) => `${(Number(value) * 100).toFixed(1)}`} />
        <CartesianGrid vertical={false} />
        <Tooltip<number, string>
          cursor={{
            fill: theme.fn.rgba(theme.colors.gray[theme.colorScheme === "dark" ? 5 : 4], 0.7)
          }}
          labelStyle={{
            color: "black"
          }}
          labelFormatter={(v) => `${t("sum")}: ${(Number(v) + Number(diceModifier))}`}
          separator=''
          formatter={value => {
            const v = (value * 100).toFixed(3);
            const disclaimer = Number(v) === 0 ? `(${t("smallChanceDisclaimer")})` : "";

            // TODO: the `as unknown as number | [number, string]` is a hack to 
            // make the type checker happy. fix it (might be a bug in recharts too)
            return [disclaimer ? `${v}% ${disclaimer}` : `${v}%`, ""] as unknown as number | [number, string];
          }} />
        <Bar dataKey="sum" fill={theme.colors.blue[theme.colorScheme === "dark" ? 8 : 6]} />
      </BarChart>
    </ResponsiveContainer> */}
		</DiceStatisticsContainer>
	);
};
