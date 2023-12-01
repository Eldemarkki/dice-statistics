import { createStyles } from "@mantine/core";

interface DiceConfigurationProps {
	dices: number[];
	diceModifier: number;
}

const useStyles = createStyles((theme) => ({
	container: {
		marginTop: 10,
	},
	dicePart: {
		display: "inline-block",
		marginRight: 5,
		padding: "2px 5px",
		borderRadius: "10px",
		fontSize: "0.9rem",
		backgroundColor: theme.colors.gray[theme.colorScheme === "dark" ? 8 : 3],
		color: theme.colors.gray[theme.colorScheme === "dark" ? 0 : 9],
	},
}));

export const DiceConfiguration = ({
	dices,
	diceModifier,
}: DiceConfigurationProps) => {
	const { classes } = useStyles();

	const amounts = dices.reduce((prev, sideCount) => {
		prev.set(sideCount, (prev.get(sideCount) || 0) + 1);
		return prev;
	}, new Map<number, number>());

	const parts = [...amounts.entries()]
		.sort((a, b) => a[0] - b[0])
		.map(([sideCount, n]) => `${n}d${sideCount}`);

	return (
		<div className={classes.container}>
			{parts.map((p) => (
				<span key={p} className={classes.dicePart}>
					{p}
				</span>
			))}
			{diceModifier ? (
				<span className={classes.dicePart}>
					{diceModifier > 0 ? `+ ${diceModifier}` : `- ${-diceModifier}`}
				</span>
			) : undefined}
		</div>
	);
};
