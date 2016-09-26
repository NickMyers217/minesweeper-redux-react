const cell = (state = {}, { type, value }) => {
  switch (type) {
    case 'CREATE_EMPTY_CELL':
      return { type: 'EMPTY', isFlagged: false, isVisible: false }

    case 'SET_CELL_BOMB':
      return state.type === 'EMPTY'
        ? Object.assign({}, state, { type: 'BOMB' })
        : state

    case 'SET_CELL_NUMBER':
      return state.type === 'EMPTY'
        ? Object.assign({}, state, { type: 'NUMBER', value })
        : state

    case 'SET_CELL_VISIBLE':
      return !state.isFlagged
        ? Object.assign({}, state, { isVisible: true })
        : state

    case 'SET_CELL_FLAGGED':
      return !state.isVisible
        ? Object.assign({}, state, { isFlagged: !state.isFlagged })
        : state

    default:
      return state
  }
}

export default cell
