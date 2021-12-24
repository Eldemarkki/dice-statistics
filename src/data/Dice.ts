import { v4 as uuid } from "uuid";

export const createDie = (sideCount: number): Dice => ({
	id: uuid(),
	sideCount
})

export default interface Dice {
	id: string,
	sideCount: number
}