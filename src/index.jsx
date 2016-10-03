import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './components/App'
import minesweeper, { Difficulties } from './reducers'
import { newGame } from './actions'

const store = createStore(minesweeper)
store.dispatch(newGame(Difficulties.EASY))

store.getState().toJS()

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
