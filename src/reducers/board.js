import { range, curry } from 'ramda'

import cell from './cell'
import * as actions from '../actions'

export const emptyBoard = (width, height, cellReducer) =>
  range(0, height).map(r =>
    range(0, width).map(c => cellReducer()))

export const getCell = curry((x, y, board) => {
  if (y > -1 && y < board.length && x > -1 && x < board[0].length) {
    return board[y][x]
  } else {
    throw new Error(`
      getCell tried to access the board at (${x}, ${y}) which was out of bounds.
    `)
  }
})

const setItem = (i, array, newVal) => array
  .slice(0, i)
  .concat(newVal)
  .concat(array.slice(i + 1))

export const setCell = curry((x, y, board, newCell) => {
  if (y > -1 && y < board.length && x > -1 && x < board[0].length) {
    return setItem(y, board, setItem(x, board[y], newCell))
  } else {
    throw new Error(`
      setCell tried to access the board at (${x}, ${y}) which was out of bounds.
    `)
  }
})

const board = (state = [], action) => {
  switch (action.type) {
    case 'CREATE_EMPTY_BOARD':
      return emptyBoard(action.width, action.height, () =>
        cell({}, actions.createEmptyCell()))

    case 'UPDATE_CELL':
      const { x, y, cellAction } = action
      return setCell(x, y, state, cell(getCell(x, y, state), cellAction))

    default:
      return state
  }
}

export default board
