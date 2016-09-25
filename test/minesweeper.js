import { expect } from 'chai';

import { minesweeper, defaultState } from '../src'

describe('Minesweeper reducers', () => {
	it('Initial state is correct', () => {
		expect(minesweeper()).to.equal(defaultState);
	});
});
