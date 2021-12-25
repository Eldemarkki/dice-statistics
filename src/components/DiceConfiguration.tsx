import React from 'react'
import styled from 'styled-components';

interface DiceConfigurationProps {
	dices: number[]
}

const Container = styled.div`
	margin-top: 10px;
`

const DicePart = styled.span`
	display: inline-block;
	margin-right: 5px;
	padding: 2px 5px;
	border-radius: 10px;
	background-color: #b0fafa;
`;

export const DiceConfiguration = ({ dices }: DiceConfigurationProps) => {
	const amounts: { [sideCount: number]: number } = dices.reduce<{
		[sideCount: number]: number
	}>((prev, sideCount) => ({
		...prev,
		[sideCount]: (prev[sideCount] || 0) + 1
	}), {})

	const parts = Object.keys(amounts).sort((a, b) => Number(a) - Number(b)).map(sideCount => `${amounts[Number(sideCount)]}d${sideCount}`);

	return (
		<Container>
			{parts.map(p => <DicePart>{p}</DicePart>)}
		</Container>
	)
}
