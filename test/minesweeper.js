/* global describe, it */

import { expect } from 'chai'

import minesweeper from '../src/reducers'

describe('Minesweeper', () => {
  it('Initial state has an initial board', () => {
    expect(minesweeper().board).to.be.a('array')
  })
})
