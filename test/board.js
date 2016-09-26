/* global describe, it */

import { expect } from 'chai'

import cell from '../src/reducers/cell'
import board, { getCell, emptyBoard } from '../src/reducers/board'
import * as actions from '../src/actions'

describe('Board', () => {
  const testBoard = emptyBoard(10, 5, () =>
    cell({}, actions.createEmptyCell()))

  it('can create an empty board of a specific width and height', () => {
    expect(board([], actions.createEmptyBoard(10, 5)))
      .to.deep.equal(testBoard)
  })

  it('can access and read a cell at a given (x, y) position', () => {
    expect(getCell(0, 3, testBoard))
      .to.deep.equal({
        type: 'EMPTY',
        isFlagged: false,
        isVisible: false
      })

    expect(() => getCell(-1, 3, testBoard)).to.throw(Error)
  })

  it('can update a cell at a given (x, y) position', () => {
    const bombAction = actions.updateCell(1, 3, actions.setCellBomb())
    const bombBoard = board(testBoard, bombAction)

    expect(getCell(1, 3, bombBoard))
      .to.deep.equal({
        type: 'BOMB',
        isFlagged: false,
        isVisible: false
      })
  })
})
