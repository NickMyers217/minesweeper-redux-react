import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'

import minesweeper, { Difficulties } from './reducers'
import * as actions from './actions'

const store = createStore(minesweeper)
store.dispatch(actions.newGame(Difficulties.EASY))

ReactDOM.render(<h1>hello world!</h1>, document.getElementById('app'))
