import { combineReducers } from 'redux'

import board from './board'

const minesweeper = combineReducers({
  board
})

export default minesweeper
