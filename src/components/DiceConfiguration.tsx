import React, { useContext } from 'react'
import styled from 'styled-components';
import { ColorSchemeContext } from './contexts/ColorSchemeContext';

interface DiceConfigurationProps {
  dices: number[],
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

export const DiceConfiguration = ({ dices }: DiceConfigurationProps) => {
  const { theme } = useContext(ColorSchemeContext);

  const amounts: { [sideCount: number]: number } = dices.reduce<{
    [sideCount: number]: number
  }>((prev, sideCount) => ({
    ...prev,
    [sideCount]: (prev[sideCount] || 0) + 1
  }), {})

  const parts = Object.keys(amounts).sort((a, b) => Number(a) - Number(b)).map(sideCount => `${amounts[Number(sideCount)]}d${sideCount}`);

  return (
    <Container>
      {parts.map(p => <DicePart key={p} darkTheme={theme === "dark"}>{p}</DicePart>)}
    </Container>
  )
}
