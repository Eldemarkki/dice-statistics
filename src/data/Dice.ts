let runningId = 0;
const createId = () => runningId++;

export const createDie = (sideCount: number): Dice => ({
	id: String(createId()),
	sideCount,
});

export default interface Dice {
	id: string;
	sideCount: number;
}
