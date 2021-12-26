import { createStyles } from '@mantine/core';

interface DiceConfigurationProps {
  dices: number[],
}

const useStyles = createStyles(theme => ({
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
    color: theme.colors.gray[theme.colorScheme === "dark" ? 0 : 9]
  }
}))

export const DiceConfiguration = ({ dices }: DiceConfigurationProps) => {
  const { classes } = useStyles();

  const amounts: { [sideCount: number]: number } = dices.reduce<{
    [sideCount: number]: number
  }>((prev, sideCount) => ({
    ...prev,
    [sideCount]: (prev[sideCount] || 0) + 1
  }), {})

  const parts = Object.keys(amounts).sort((a, b) => Number(a) - Number(b)).map(sideCount => `${amounts[Number(sideCount)]}d${sideCount}`);

  return (
    <div className={classes.container}>
      {parts.map(p => <span key={p} className={classes.dicePart}>{p}</span>)}
    </div>
  )
}
