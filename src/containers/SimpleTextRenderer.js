import React from 'react'
import { connect } from 'react-redux'

import { leftClick } from '../actions'

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

const Game = ({state, onLeftClick}) => (
  <div>
    <span>
      Bombs: {state.bombCount.toString()} |
      Difficulty: {state.difficulty} |
      Win: {state.gameWon.toString()} |
      Loss: {state.gameLoss.toString()}
    </span>
    <div>
      {state.board.map((r, y) => (
        <div key={y}>
          {r.map((c, x) => (
            <button
              key={x}
              style={{width: '30px', height: '30px'}}
              onClick={() => onLeftClick(x, y)}>
              {cellToText(c)}
            </button>
          ))}
        </div>
      ))}
    </div>
  </div>
)

const mapStateToProps = (state) => ({
  state: state.toJS()
})

const mapDispatchToProps = (dispatch) => ({
  // TODO: Make props for the actions
  onLeftClick: (x, y) => {
    dispatch(leftClick(x, y))
  }
  // rightClick
  // newGame
})

const SimpleTextRenderer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)

export default SimpleTextRenderer
