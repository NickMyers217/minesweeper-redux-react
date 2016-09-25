import { range } from 'ramda';


export const defaultState = range(0, 10).map(row => (
	range(0, 10).map(cell => {})
));

export const minesweeper = (state = defaultState, action) => {
	return state;
};
