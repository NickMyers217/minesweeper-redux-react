/* global describe, it */

import { expect } from 'chai'
import { fromJS } from 'immutable'

import cell from '../src/reducers/cell'
import * as actions from '../src/actions'

describe('Cell', () => {
  const emptyCell = {
    type: 'EMPTY',
    isFlagged: false,
    isVisible: false
  }
  const bombCell = {
    type: 'BOMB',
    isFlagged: false,
    isVisible: false
  }
  const numFiveCell = {
    type: 'NUMBER',
    value: 5,
    isFlagged: false,
    isVisible: false
  }
  const visibleCell = {
    type: 'EMPTY',
    isFlagged: false,
    isVisible: true
  }
  const nonVisibleCell = {
    type: 'EMPTY',
    isFlagged: false,
    isVisible: false
  }

  it('a default empty cell is initialized correctly', () => {
    expect(cell({}, actions.createEmptyCell()))
      .to.deep.equal(emptyCell)
  })

  it('can turn an empty cell into a bomb. Only an empty cell', () => {
    expect(cell(emptyCell, actions.setCellBomb()))
      .to.deep.equal(bombCell)

    expect(cell(bombCell, actions.setCellBomb()))
      .to.deep.equal(bombCell)

    expect(cell(numFiveCell, actions.setCellBomb()))
      .to.deep.equal(numFiveCell)
  })

  it('can turn an empty cell into a number. Only an empty cell', () => {
    expect(cell(emptyCell, actions.setCellNumber(5)))
      .to.deep.equal(numFiveCell)

    expect(cell(bombCell, actions.setCellNumber(5)))
      .to.deep.equal(bombCell)

    expect(cell(numFiveCell, actions.setCellNumber(5)))
      .to.deep.equal(numFiveCell)
  })

  it('can make a cell visible, but only if its not flagged', () => {
    expect(cell(emptyCell, actions.setCellVisible()))
      .to.have.any.keys({'isVisible': true})

    expect(cell(bombCell, actions.setCellVisible()))
      .to.have.any.keys({'isVisible': true})

    expect(cell(numFiveCell, actions.setCellVisible()))
      .to.have.any.keys({'isVisible': true})

    expect(cell(Object.assign({}, emptyCell, {isFlagged: true}),
                actions.setCellVisible()))
      .to.deep.equal(Object.assign({}, emptyCell, {isFlagged: true}))
  })

  it('can flag an non visible cell, but not a visible one', () => {
    expect(cell(nonVisibleCell, actions.setCellFlagged()))
      .to.deep.equal(Object.assign({}, nonVisibleCell, {isFlagged: true}))

    expect(cell(visibleCell, actions.setCellFlagged()))
      .to.deep.equal(visibleCell)
  })

  it('flagging a flagged cell unflags it', () => {
    expect(cell(Object.assign({}, emptyCell, {isFlagged: true}), actions.setCellFlagged()))
      .to.deep.equal(emptyCell)
  })
})
