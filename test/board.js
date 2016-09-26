/* global describe, it */

import { expect } from 'chai'

import cell from '../src/reducers/cell'
import board, { emptyBoard } from '../src/reducers/board'
import * as actions from '../src/actions'

describe('Board', () => {
  const testBoard = emptyBoard(10, 5, () =>
    cell({}, actions.createEmptyCell()))

  it('can create an empty board of a specific width and height', () => {
    expect(board([], actions.createEmptyBoard(10, 5)))
      .to.deep.equal(testBoard)
  })
})
