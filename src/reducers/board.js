import { range } from 'ramda'

import cell from './cell'
import * as actions from '../actions'

export const emptyBoard = range(0, 10).map(r => (
  range(0, 10).map(c => cell({}, actions.createEmptyCell()))
))

const board = (state = emptyBoard, action) => {
  return state
}

export default board
