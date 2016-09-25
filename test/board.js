/* global describe, it */

import { expect } from 'chai'

import board, { emptyBoard } from '../src/reducers/board'

describe('Board', () => {
  it('Initial state is an empty 10 x 10 board', () => {
    expect(board()).to.equal(emptyBoard)
  })
})
