import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './components/App'
import minesweeper from './reducers'

const store = createStore(minesweeper)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
