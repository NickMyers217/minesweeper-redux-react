/* global describe, it */

import { expect } from 'chai'
import { Map } from 'immutable'
import { createStore } from 'redux'

import minesweeper, { Difficulties, isGameLoss, isGameWon } from '../src/reducers'
import * as actions from '../src/actions'

describe('Minesweeper', () => {
  describe('#isGameLoss()', () => {
    it('returns true if the game is lost', () => {
      const store = createStore(minesweeper)
      store.dispatch(actions.newGame(Difficulties.MEDIUM))

      expect(isGameLoss(store
          .getState()
          .update('board', b => b
            .map(row => row
              .map(c => c.get('type') === 'BOMB'
                ? c.set('isVisible', true)
                : c)))))
        .to.equal(true)
    })

    it('returns false if the game is not lost', () => {
      const store = createStore(minesweeper)
      store.dispatch(actions.newGame(Difficulties.HARD))

      expect(isGameLoss(store.getState()))
        .to.equal(false)
    })
  })

  describe('#isGameWon()', () => {
    it('returns true if the game is won', () => {
      const store = createStore(minesweeper)
      store.dispatch(actions.newGame(Difficulties.EASY))

      expect(isGameWon(store
          .getState()
          .update('board', b => b
            .map(row => row
              .map(c => c.get('type') !== 'BOMB'
                ? c.set('isVisible', true)
                : c)))))
        .to.equal(true)
    })

    it('returns false if the game is not won', () => {
      const store = createStore(minesweeper)
      store.dispatch(actions.newGame(Difficulties.EASY))

      expect(isGameWon(store.getState()))
        .to.equal(false)
    })
  })

  describe('Actions', () => {
    describe('#newGame()', () => {
      it('creates the correct initial state', () => {
        const countBombs = board => board
          .flatMap(row => row
            .filter(cell => cell.get('type') === 'BOMB'))
              .count()
        const store = createStore(minesweeper)
        store.dispatch(actions.newGame(Difficulties.EASY))

        expect(countBombs(store.getState().get('board')))
          .to.equal(Difficulties.EASY.bombs)

        expect(store.getState())
          .to.equal(Map({
            board: store.getState().get('board'),
            bombCount: Difficulties.EASY.bombs,
            gameWon: false,
            gameLoss: false
          }))
      })
    })

    describe('#leftClick()', () => {
      it('updates the correct cell\'s visibility', () => {
        const store = createStore(minesweeper)
        store.dispatch(actions.newGame(Difficulties.EASY))

        store.dispatch(actions.leftClick(1, 2))
        expect(store.getState().getIn([ 'board', 2, 1, 'isVisible' ]))
          .to.equal(true)
      })
    })

    describe('#rightClick()', () => {
      it('updates the correct cell\'s flag status', () => {
        const store = createStore(minesweeper)
        store.dispatch(actions.newGame(Difficulties.MEDIUM))

        store.dispatch(actions.rightClick(1, 2))
        expect(store.getState().getIn([ 'board', 2, 1, 'isFlagged' ]))
          .to.equal(true)

        store.dispatch(actions.rightClick(1, 2))
        expect(store.getState().getIn([ 'board', 2, 1, 'isFlagged' ]))
          .to.equal(false)
      })
    })
  })
})
