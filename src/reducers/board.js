import { range } from 'ramda'

import cell from './cell'
import * as actions from '../actions'

export const emptyBoard = (width, height, cellReducer) =>
  range(0, height).map(r =>
    range(0, width).map(c => cellReducer()))

const board = (state = [], { type, width, height }) => {
  switch (type || '') {
    case 'CREATE_EMPTY_BOARD':
      return emptyBoard(width, height, () =>
        cell({}, actions.createEmptyCell()))

    default:
      return state
  }
}

export default board
