import { Map } from 'immutable'

import board, { getCascadeCoords } from './board'
import * as actions from '../actions'

export const Difficulties = {
  EASY: { width: 10, height: 10, bombs: 10 },
  MEDIUM: { width: 20, height: 20, bombs: 20 },
  HARD: { width: 30, height: 30, bombs: 30 },
  INSANE: { width: 50, height: 50, bombs: 50 }
}

export const isGameLoss = (state) => state
  .get('board')
  .flatMap(row => row
    .filter(c => c.get('type') === 'BOMB'))
  .filter(bomb => bomb.get('isVisible'))
  .count() > 0

export const isGameWon = (state) => {
  const isLoss = isGameLoss(state)
  const height = state.get('board').count()
  const width = state.getIn([ 'board', 0 ]).count()
  const totalCount = height * width
  const bombCount = state.get('bombCount')
  const visibleCellCount = state
    .get('board')
    .flatMap(row => row
      .filter(c => c.get('type') !== 'BOMB'))
    .filter(c => c.get('isVisible'))
    .count()

  return (
    !isLoss && (totalCount - visibleCellCount) === bombCount
  )
}

const minesweeper = (state = Map({}), action) => {
  const {x, y} = action

  switch (action.type) {
    case 'NEW_GAME':
      const { width, height, bombs } = action
      const newBoardActions = [
        actions.createEmptyBoard(width, height),
        actions.placeBombs(bombs),
        actions.calculateNumbers()
      ]
      return state
        .update('board', b => newBoardActions
          .reduce((s, a) => board(s, a), b))
        .set('bombCount', bombs)
        .set('gameLoss', false)
        .set('gameWon', false)

    case 'LEFT_CLICK':
      // TODO: Debug why this isnt working
      const needsCascade = state
        .getIn(['board', y, x, 'type']) === 'EMPTY'

      const visibilityActions = needsCascade
        ? [actions.updateCell(x, y, actions.setCellVisible())]
        : getCascadeCoords({x, y}, state.get('board'))
            .map(({x, y}) => actions.updateCell(x, y, actions.setCellVisible()))

      const updatedBoardState = state
        .update('board', b => {
          return visibilityActions.reduce((curState, curAction) => (
            board(curState, curAction)
          ), state.get('board'))
        })

      if (isGameLoss(updatedBoardState)) {
        return updatedBoardState
          .set('gameLoss', true)
      }

      if (isGameWon(updatedBoardState)) {
        return updatedBoardState
          .set('gameWon', true)
      }

      return updatedBoardState

    case 'RIGHT_CLICK':
      const flaggedAction = actions
        .updateCell(x, y, actions.setCellFlagged())
      return state
        .update('board', b => board(b, flaggedAction))

    default:
      return state
  }
}

export default minesweeper
