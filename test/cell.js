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

  describe('Actions', () => {
    describe('#createEmptyCell()', () => {
      it('a default empty cell is initialized correctly', () => {
        expect(cell({}, actions.createEmptyCell()))
          .to.equal(emptyCell)
      })
    })

    describe('#setCellBomb()', () => {
      it('can turn an empty cell into a bomb', () => {
        expect(cell(emptyCell, actions.setCellBomb()))
          .to.equal(bombCell)
      })

      it('does not mutate a cell that is already a bomb', () => {
        expect(cell(bombCell, actions.setCellBomb()))
          .to.equal(bombCell)
      })

      it('does not mutate a cell that is a number', () => {
        expect(cell(numFiveCell, actions.setCellBomb()))
          .to.equal(numFiveCell)
      })
    })

    describe('#setCellNumber()', () => {
      it('can turn an empty cell into a number greater than zero', () => {
        expect(cell(emptyCell, actions.setCellNumber(5)))
          .to.equal(numFiveCell)
      })

      it('does not mutate the cell if the number is zero or less', () => {
        expect(cell(emptyCell, actions.setCellNumber(0)))
          .to.equal(emptyCell)
      })

      it('does not mutate the cell if it is a bomb', () => {
        expect(cell(bombCell, actions.setCellNumber(5)))
          .to.equal(bombCell)
      })

      it('does not mutate the cell if it is a number already', () => {
        expect(cell(numFiveCell, actions.setCellNumber(6)))
          .to.equal(numFiveCell)
      })
    })

    describe('#setCellVisible()', () => {
      it('sets an empty cell to visible', () => {
        expect(cell(emptyCell, actions.setCellVisible()))
          .to.have.any.keys({'isVisible': true})
      })

      it('sets a bomb cell to visible', () => {
        expect(cell(bombCell, actions.setCellVisible()))
          .to.have.any.keys({'isVisible': true})
      })

      it('sets a number cell to visible', () => {
        expect(cell(numFiveCell, actions.setCellVisible()))
          .to.have.any.keys({'isVisible': true})
      })

      it('does not mutate a flagged cell', () => {
        expect(cell(emptyCell.set('isFlagged', true), actions.setCellVisible()))
          .to.equal(emptyCell.set('isFlagged', true))
      })

      it('does not mutate an already visible cell', () => {
        expect(cell(emptyCell.set('isVisible', true), actions.setCellVisible()))
          .to.equal(emptyCell.set('isVisible', true))
      })
    })

    describe('#setCellFlagged()', () => {
      it('can flag an non visible cell', () => {
        expect(cell(nonVisibleCell, actions.setCellFlagged()))
        .to.equal(nonVisibleCell.set('isFlagged', true))
      })

      it('does not mutate a visible cell', () => {
        expect(cell(visibleCell, actions.setCellFlagged()))
        .to.equal(visibleCell)
      })

      it('flagging a flagged cell unflags it', () => {
        expect(cell(emptyCell.set('isFlagged', true), actions.setCellFlagged()))
          .to.equal(emptyCell)
      })
    })
  })
})
