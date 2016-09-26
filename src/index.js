import { createStore } from 'redux'

import minesweeper from './reducers'
import * as actions from './actions'

const store = createStore(minesweeper)

store.dispatch(actions.createEmptyBoard(10, 5))

console.log(store.getState())
