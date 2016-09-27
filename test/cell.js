/* global describe, it */

import { expect } from 'chai'
import { Map } from 'immutable'

import cell from '../src/reducers/cell'
import * as actions from '../src/actions'

describe('Cell', () => {
  const emptyCell = Map({
    type: 'EMPTY',
    isFlagged: false,
    isVisible: false
  })
  const bombCell = emptyCell
    .set('type', 'BOMB')
  const numFiveCell = emptyCell
    .set('type', 'NUMBER')
    .merge(Map({ value: 5 }))
  const visibleCell = emptyCell
    .set('isVisible', true)
  const nonVisibleCell = emptyCell

  it('a default empty cell is initialized correctly', () => {
    expect(cell({}, actions.createEmptyCell()))
      .to.equal(emptyCell)
  })

  it('can turn an empty cell into a bomb. Only an empty cell', () => {
    expect(cell(emptyCell, actions.setCellBomb()))
      .to.equal(bombCell)

    expect(cell(bombCell, actions.setCellBomb()))
      .to.equal(bombCell)

    expect(cell(numFiveCell, actions.setCellBomb()))
      .to.equal(numFiveCell)
  })

  it('can turn an empty cell into a number greater than zero. Only an empty cell', () => {
    expect(cell(emptyCell, actions.setCellNumber(5)))
      .to.equal(numFiveCell)

    expect(cell(bombCell, actions.setCellNumber(5)))
      .to.equal(bombCell)

    expect(cell(numFiveCell, actions.setCellNumber(5)))
      .to.equal(numFiveCell)

    expect(cell(emptyCell, actions.setCellNumber(0)))
      .to.equal(emptyCell)
  })

  it('can make a cell visible, but only if its not flagged', () => {
    expect(cell(emptyCell, actions.setCellVisible()))
      .to.have.any.keys({'isVisible': true})

    expect(cell(bombCell, actions.setCellVisible()))
      .to.have.any.keys({'isVisible': true})

    expect(cell(numFiveCell, actions.setCellVisible()))
      .to.have.any.keys({'isVisible': true})

    expect(cell(emptyCell.set('isFlagged', true), actions.setCellVisible()))
      .to.equal(emptyCell.set('isFlagged', true))
  })

  it('can flag an non visible cell, but not a visible one', () => {
    expect(cell(nonVisibleCell, actions.setCellFlagged()))
      .to.equal(nonVisibleCell.set('isFlagged', true))

    expect(cell(visibleCell, actions.setCellFlagged()))
      .to.equal(visibleCell)
  })

  it('flagging a flagged cell unflags it', () => {
    expect(cell(emptyCell.set('isFlagged', true), actions.setCellFlagged()))
      .to.equal(emptyCell)
  })
})
