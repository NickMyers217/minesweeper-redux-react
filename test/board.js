/* global describe, it */

import { expect } from 'chai'
import { fromJS, Map } from 'immutable'

import cell from '../src/reducers/cell'
import board, { emptyBoard, getNeighborCoords } from '../src/reducers/board'
import * as actions from '../src/actions'

describe('Board', () => {
  const testBoard = emptyBoard(10, 5, () =>
    cell(Map({}), actions.createEmptyCell()))

  it('can access and read a cell at a given (x, y) position', () => {
    expect(testBoard.get(3).get(0))
      .to.equal(Map({
        type: 'EMPTY',
        isFlagged: false,
        isVisible: false
      }))
  })

  describe('#getNeighborCoords()', () => {
    it('gets the neighbors for a cell in the middle', () => {
      const middleNeighbors = getNeighborCoords(2, 2, 4, 4)
      expect(middleNeighbors).to.deep.equal([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 1, y: 2 },
        { x: 3, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 }
      ])
    })

    it('gets the neighbors for the top left corner', () => {
      const topLeftNeighbors = getNeighborCoords(0, 0, 4, 4)
      expect(topLeftNeighbors).to.deep.equal([
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
      ])
    })

    it('gets the neighbors for the top right corner', () => {
      const topRightNeighbors = getNeighborCoords(3, 0, 4, 4)
      expect(topRightNeighbors).to.deep.equal([
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 3, y: 1 }
      ])
    })

    it('gets the neighbors for the bottom left corner', () => {
      const botLeftNeighbors = getNeighborCoords(0, 3, 4, 4)
      expect(botLeftNeighbors).to.deep.equal([
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 3 }
      ])
    })

    it('gets the neighbors for the bottom right corner', () => {
      const botRightNeighbors = getNeighborCoords(3, 3, 4, 4)
      expect(botRightNeighbors).to.deep.equal([
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 2, y: 3 }
      ])
    })
  })

  describe('Actions', () => {
    describe('#createEmptyBoard()', () => {
      it('can create an empty board of a specific width and height', () => {
        expect(board([], actions.createEmptyBoard(10, 5)))
        .to.deep.equal(testBoard)
      })
    })

    describe('#updateCell()', () => {
      it('can update an empty cell as a bomb at a given (x, y) position', () => {
        const bombAction = actions.updateCell(1, 3, actions.setCellBomb())
        const bombBoard = board(testBoard, bombAction)
        expect(bombBoard.get(3).get(1))
          .to.equal(Map({
            type: 'BOMB',
            isFlagged: false,
            isVisible: false
          }))
      })

      it('can update an empty cell as a number at a given (x, y) position', () => {
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

    describe('#placeBombs()', () => {
      it('can place a given number of bombs in random cells', () => {
        const countBombs = board => board
          .flatMap(row => row
            .filter(cell => cell.get('type') === 'BOMB'))
              .count()
        const bombBoard = board(testBoard, actions.placeBombs(10))

        expect(countBombs(bombBoard)).to.equal(10)
      })
    })

    describe('#calculateNumbers()', () => {
      it('can calculate all the numbers based on their adjacent bombs', () => {
        const smallBoard = emptyBoard(4, 4, () =>
          cell(Map({}), actions.createEmptyCell()))
        const bombActions = [
          actions.updateCell(1, 1, actions.setCellBomb()),
          actions.updateCell(2, 3, actions.setCellBomb()),
          actions.updateCell(2, 2, actions.setCellBomb())
        ]
        const bombBoard = bombActions
          .reduce((curState, curAction) => board(curState, curAction), smallBoard)
        const numBoard = board(bombBoard, actions.calculateNumbers())
        const expectedBoard = fromJS([
          [ { type: 'NUMBER', value: 1, isFlagged: false, isVisible: false },
            { type: 'NUMBER', value: 1, isFlagged: false, isVisible: false },
            { type: 'NUMBER', value: 1, isFlagged: false, isVisible: false },
            { type: 'EMPTY', isFlagged: false, isVisible: false } ],
          [ { type: 'NUMBER', value: 1, isFlagged: false, isVisible: false },
            { type: 'BOMB', isFlagged: false, isVisible: false },
            { type: 'NUMBER', value: 2, isFlagged: false, isVisible: false },
            { type: 'NUMBER', value: 1, isFlagged: false, isVisible: false } ],
          [ { type: 'NUMBER', value: 1, isFlagged: false, isVisible: false },
            { type: 'NUMBER', value: 3, isFlagged: false, isVisible: false },
            { type: 'BOMB', isFlagged: false, isVisible: false },
            { type: 'NUMBER', value: 2, isFlagged: false, isVisible: false } ],
          [ { type: 'EMPTY', isFlagged: false, isVisible: false },
            { type: 'NUMBER', value: 2, isFlagged: false, isVisible: false },
            { type: 'BOMB', isFlagged: false, isVisible: false },
            { type: 'NUMBER', value: 2, isFlagged: false, isVisible: false } ]
        ])

        expect(numBoard).to.deep.equal(expectedBoard)
      })
    })
  })
})
