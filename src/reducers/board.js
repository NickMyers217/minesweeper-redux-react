import { List, Map, Range } from 'immutable'

import cell from './cell'
import * as actions from '../actions'

export const emptyBoard = (width, height, cellReducer) =>
  List(Range(0, height).map(r =>
    List(Range(0, width).map(c =>
      cellReducer()))))

const board = (state = List([]), action) => {
  switch (action.type) {
    case 'CREATE_EMPTY_BOARD':
      const { width, height } = action
      return emptyBoard(width, height, () =>
        cell(Map({}), actions.createEmptyCell()))

    case 'UPDATE_CELL':
      const { x, y, cellAction } = action
      const newCell = cell(state.get(y).get(x), cellAction)
      return state.set(y, state.get(y).set(x, newCell))

    default:
      return state
  }
}

export default board
