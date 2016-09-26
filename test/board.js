/* global describe, it */

import { expect } from 'chai'
import { Map } from 'immutable'

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

  it('can access and read a cell at a given (x, y) position', () => {
    expect(testBoard.get(3).get(0))
      .to.equal(Map({
        type: 'EMPTY',
        isFlagged: false,
        isVisible: false
      }))
  })

  it('can update a cell at a given (x, y) position', () => {
    const bombAction = actions.updateCell(1, 3, actions.setCellBomb())
    const bombBoard = board(testBoard, bombAction)
    expect(bombBoard.get(3).get(1))
      .to.equal(Map({
        type: 'BOMB',
        isFlagged: false,
        isVisible: false
      }))

    const numAction = actions.updateCell(2, 4, actions.setCellNumber(3))
    const numBoard = board(testBoard, numAction)
    expect(numBoard.get(4).get(2))
      .to.equal(Map({
        type: 'NUMBER',
        isFlagged: false,
        isVisible: false,
        value: 3
      }))
  })
})
