import React from 'react'
import { connect } from 'react-redux'

import { leftClick, rightClick, newGame } from '../actions'

const cellToText = (cell) => {
  const {isVisible, isFlagged, type, value} = cell

  if (isFlagged) {
    return 'f'
  }

  if (isVisible) {
    if (type === 'EMPTY') return 'x'
    else if (type === 'BOMB') return 'b'
    else return value.toString()
  }

  return '_'
}

const Game = ({state, onNewGame, onLeftClick, onRightClick}) => (
  <div>
    <span>
      Bombs: {state.bombCount || ''} |
      Difficulty: {state.difficulty || ''} |
      Win: {state.gameWon ? 'yes' : 'no'} |
      Loss: {state.gameLoss ? 'yes' : 'no'}
    </span>

    <div>
      {state.board !== undefined
        ? state.board.map((r, y) => (
            <div key={y}>
              {r.map((c, x) => (
                <button
                  key={x}
                  style={{width: '30px', height: '30px'}}
                  // TODO: Handle both left and right click
                  onClick={() => onLeftClick(x, y)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    onRightClick(x, y)
                  }}>
                  {cellToText(c)}
                </button>
              ))}
            </div>
          ))
        : <div>:(</div>
      }
    </div>

    <div>
      <p>Start a new game:</p>
      <span>
        {
          Object
            .keys(state.difficulties)
            .map(key => state.difficulties[key])
            .map((difficulty, id) => (
              <button
                key={id}
                onClick={() => onNewGame(difficulty)}>
                {difficulty.text}
              </button>
            ))
        }
      </span>
    </div>
  </div>
)

const mapStateToProps = (state) => ({
  state: state.toJS()
})

const mapDispatchToProps = (dispatch) => ({
  onLeftClick: (x, y) => {
    dispatch(leftClick(x, y))
  },
  onNewGame: (difficulty) => {
    dispatch(newGame(difficulty))
  },
  onRightClick: (x, y) => {
    dispatch(rightClick(x, y))
  }
})

const SimpleTextRenderer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)

export default SimpleTextRenderer
