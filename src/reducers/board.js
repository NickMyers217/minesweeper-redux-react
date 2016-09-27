import { List, Map, Range } from 'immutable'
import { range, uniq, curry } from 'ramda'

import cell from './cell'
import * as actions from '../actions'

const getRandomInt = (max) => Math.floor(Math.random() * max)

const getRandomCoordinates = (count, maxw, maxh) => {
  const coords = uniq(
    range(0, count)
      .map(_ => ({
        x: getRandomInt(maxw),
        y: getRandomInt(maxh)
      }))
  )

  return coords.length === count
    ? coords
    : getRandomCoordinates(count, maxw, maxh)
}

const directions = [
  { dx: -1, dy: -1 },
  { dx: +0, dy: -1 },
  { dx: +1, dy: -1 },
  { dx: -1, dy: +0 },
  { dx: +1, dy: +0 },
  { dx: -1, dy: +1 },
  { dx: +0, dy: +1 },
  { dx: +1, dy: +1 }
]

export const emptyBoard = (width, height, cellReducer) =>
  List(Range(0, height)
    .map(r => List(Range(0, width)
      .map(c => cellReducer()))))

export const getNeighborCoords = curry(
  (x, y, width, height) => {
    if (width <= 1 || height <= 1) {
      throw new Error('You need a bigger board')
    }

    return directions
      .map(({dx, dy}) => ({ x: x + dx, y: y + dy }))
      .filter(({x, y}) => x > -1 && x < width && y > -1 && y < height)
  }
)

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

    case 'PLACE_BOMBS':
      const { count } = action
      const coords = getRandomCoordinates(count, state.get(0).count(), state.count())
      const bombActions = coords
        .map(({x, y}) => actions.updateCell(x, y, actions.setCellBomb()))
      return bombActions
        .reduce((curState, curAction) => board(curState, curAction), state)

    case 'CALCULATE_NUMBERS':
      const h = state.count()
      const w = state.first().count()
      return state
        .map((row, y) => row
          .map((c, x) => {
            const number = getNeighborCoords(x, y, w, h)
              .map(({x, y}) => state.get(y).get(x).get('type'))
              .filter(t => t === 'BOMB')
              .length
            return cell(c, actions.setCellNumber(number))
          }))

    default:
      return state
  }
}

export default board
