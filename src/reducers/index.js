import { Map } from 'immutable'

import board, { getCascadeCoords } from './board'
import { createEmptyBoard
       , placeBombs
       , calculateNumbers
       , updateCell
       , setCellVisible
       , setCellFlagged
       } from '../actions'

export const Difficulties = {
  EASY: { width: 10, height: 10, bombs: 10, text: 'Easy' },
  MEDIUM: { width: 20, height: 20, bombs: 20, text: 'Medium' },
  HARD: { width: 30, height: 30, bombs: 30, text: 'Hard' },
  INSANE: { width: 50, height: 50, bombs: 50, text: 'Insane' }
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

const minesweeper = (state = Map({difficulties: Difficulties}), action) => {
  const {x, y} = action

  switch (action.type) {
    case 'NEW_GAME':
      const {width, height, bombs, text} = action
      const newBoardActions = [
        createEmptyBoard(width, height),
        placeBombs(bombs),
        calculateNumbers()
      ]
      return state
        .update('board', b => newBoardActions
          .reduce((s, a) => board(s, a), b))
        .set('difficulty', text)
        .set('bombCount', bombs)
        .set('gameLoss', false)
        .set('gameWon', false)

    case 'LEFT_CLICK':
      const needsCascade = state
        .getIn(['board', y, x, 'type']) === 'EMPTY'

      const visibilityActions = needsCascade
        ? getCascadeCoords({x, y}, state.get('board'))
            .map(({x, y}) => updateCell(x, y, setCellVisible()))
        : [updateCell(x, y, setCellVisible())]

      const updatedBoardState = state
        .update('board', b => {
          return visibilityActions.reduce(
            (curState, curAction) => (board(curState, curAction)
          ), state.get('board'))
        })

      if (isGameLoss(updatedBoardState)) {
        return updatedBoardState.set('gameLoss', true)
      }

      if (isGameWon(updatedBoardState)) {
        return updatedBoardState.set('gameWon', true)
      }

      return updatedBoardState

    case 'RIGHT_CLICK':
      return state
        .update('board', b => board(b, updateCell(x, y, setCellFlagged())))

    default:
      return state
  }
}

export default minesweeper
