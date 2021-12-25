import React from 'react'
import styled from 'styled-components';

interface DiceConfigurationProps {
  dices: number[],
  darkTheme?: boolean | undefined
}

const Container = styled.div`
	margin-top: 10px;
`

interface DicePartProps {
  darkTheme?: boolean | undefined;
}

const DicePart = styled.span<DicePartProps>`
	display: inline-block;
	margin-right: 5px;
	padding: 2px 5px;
	border-radius: 10px;
  font-size: 0.9rem;
	background-color: ${props => props.darkTheme ? "#333438" : "#dadcde"};
  color: ${props => props.darkTheme ? "white" : "blacke9ecef"};
`;

export const DiceConfiguration = ({ dices, darkTheme }: DiceConfigurationProps) => {
  const amounts: { [sideCount: number]: number } = dices.reduce<{
    [sideCount: number]: number
  }>((prev, sideCount) => ({
    ...prev,
    [sideCount]: (prev[sideCount] || 0) + 1
  }), {})

  const parts = Object.keys(amounts).sort((a, b) => Number(a) - Number(b)).map(sideCount => `${amounts[Number(sideCount)]}d${sideCount}`);

  return (
    <Container>
      {parts.map(p => <DicePart key={p} darkTheme={darkTheme}>{p}</DicePart>)}
    </Container>
  )
}
