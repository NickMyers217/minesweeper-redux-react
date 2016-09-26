/* global describe, it */

import { expect } from 'chai'
import { createStore } from 'redux'

import minesweeper from '../src/reducers'
import * as actions from '../src/actions'

describe('Minesweeper', () => {
  it('can create the correct initial game state', () => {
    const store = createStore(minesweeper)

    store.dispatch(actions.createEmptyBoard(10, 10))

    expect(store.getState().board)
      .to.not.be.undefined
  })
})
