import { createStore } from 'redux'

import minesweeper from './reducers'
import * as actions from './actions'

const store = createStore(minesweeper)

store.dispatch(actions.createEmptyBoard())
store.dispatch(actions.placeBombs(10))
store.dispatch(actions.calculateNumbers())

document.body.innerHTML = `
  <div><pre><code>
    ${JSON.stringify(store.getState(), null, 4)}
  </code></pre></div>
`

console.log(store.getState())
