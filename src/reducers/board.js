import { range } from 'ramda'

export const emptyBoard = range(0, 10).map(row => (
  range(0, 10).map(cell => {})
))

const board = (state = emptyBoard, action) => {
  return state
}

export default board
