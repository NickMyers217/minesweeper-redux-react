/* global describe, it */

import { expect } from 'chai'
import { Map } from 'immutable'
import { createStore } from 'redux'
import { uniq } from 'ramda'

import { getCascadeCoords } from '../src/reducers/board'
import * as actions from '../src/actions'
import minesweeper, { Difficulties
                    , isGameLoss
                    , isGameWon
                    } from '../src/reducers'

describe('Minesweeper', () => {
  describe('#isGameLoss()', () => {
    it('returns true if the game is lost', () => {
      const store = createStore(minesweeper)
      store.dispatch(actions.newGame(Difficulties.MEDIUM))

      expect(isGameLoss(store.getState()
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

      expect(isGameWon(store.getState()
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
            difficulties: Difficulties,
            board: store.getState().get('board'),
            difficulty: Difficulties.EASY.text,
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

      it('the cascade effect happens correctly when an empty cell is clicked', () => {
        const store = createStore(minesweeper)
        store.dispatch(actions.newGame(Difficulties.EASY))

        const empty = store.getState().get('board')
          .flatMap((row, y) => row
            .map((c, x) => ({type: c.get('type'), x, y})))
          .filter(({type}) => type === 'EMPTY')
          .first()

        store.dispatch(actions.leftClick(empty.x, empty.y))

        const st = store.getState()
        const cascadeCoords = getCascadeCoords(empty, st.get('board'))
        expect(uniq(cascadeCoords).length)
          .to.equal(cascadeCoords.length)

        const coordsNotRevealed = cascadeCoords
          .filter(({x, y}) => {
            const {type, isVisible} = st.getIn(['board', y, x]).toJS()
            return type !== 'BOMB' && !isVisible
          })

        expect(coordsNotRevealed.length).to.equal(0)
      })

      it('marks the game lost if a bomb is left clicked', () => {
        const store = createStore(minesweeper)
        store.dispatch(actions.newGame(Difficulties.EASY))

        const bomb = store.getState().get('board')
          .flatMap((row, y) => row
            .map((c, x) => ({ type: c.get('type'), x, y })))
          .filter(({ type }) => type === 'BOMB')
          .first()

        store.dispatch(actions.leftClick(bomb.x, bomb.y))

        expect(isGameLoss(store.getState()))
          .to.equal(true)

        expect(store.getState().get('gameLoss'))
          .to.equal(true)
      })

      it('marks the game won if all the non bomb cells are visible', () => {
        const store = createStore(minesweeper)
        store.dispatch(actions.newGame(Difficulties.EASY))

        store.getState()
          .get('board')
          .flatMap((row, y) => row
            .map((c, x) => ({ type: c.get('type'), x, y })))
          .filter(({ type }) => type !== 'BOMB')
          .map(({x, y}) => actions.leftClick(x, y))
          .forEach(a => store.dispatch(a))

        expect(isGameWon(store.getState()))
          .to.equal(true)

        expect(store.getState().get('gameWon'))
          .to.equal(true)
      })

      it('cannot left click any cell if the game has been lost', () => {
        const store = createStore(minesweeper)
        store.dispatch(actions.newGame(Difficulties.EASY))

        const allCells = store
          .getState()
          .get('board')
          .flatMap((row, y) => row
            .map((c, x) => ({type: c.get('type'), x, y})))

        const firstBomb = allCells
          .filter(c => c.type === 'BOMB')
          .first()

        const firstEmpty = allCells
          .filter(c => c.type === 'EMPTY')
          .first()

        store.dispatch(actions.leftClick(firstBomb.x, firstBomb.y))
        expect(store.getState().get('gameLoss')).to.equal(true)

        store.dispatch(actions.leftClick(firstEmpty.x, firstEmpty.y))
        expect(
          store.getState()
            .getIn(['board', firstEmpty.y, firstEmpty.x, 'isVisible'])
        ).to.equal(false)
      })
    })

    describe('#rightClick()', () => {
      it('updates the correct cell\'s flag status', () => {
        const store = createStore(minesweeper)
        store.dispatch(actions.newGame(Difficulties.MEDIUM))

        store.dispatch(actions.rightClick(1, 2))
        expect(store.getState().getIn(['board', 2, 1, 'isFlagged']))
          .to.equal(true)

        store.dispatch(actions.rightClick(1, 2))
        expect(store.getState().getIn(['board', 2, 1, 'isFlagged']))
          .to.equal(false)
      })

      it('cannot right click any cell if the game has been lost', () => {
        const store = createStore(minesweeper)
        store.dispatch(actions.newGame(Difficulties.EASY))

        const allCells = store
          .getState()
          .get('board')
          .flatMap((row, y) => row
            .map((c, x) => ({type: c.get('type'), x, y})))

        const firstBomb = allCells
          .filter(c => c.type === 'BOMB')
          .first()

        const firstEmpty = allCells
          .filter(c => c.type === 'EMPTY')
          .first()

        store.dispatch(actions.leftClick(firstBomb.x, firstBomb.y))
        expect(store.getState().get('gameLoss')).to.equal(true)

        store.dispatch(actions.rightClick(firstEmpty.x, firstEmpty.y))
        expect(
          store.getState()
            .getIn(['board', firstEmpty.y, firstEmpty.x, 'isFlagged'])
        ).to.equal(false)
      })
    })
  })
})
