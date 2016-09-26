import { Map } from 'immutable'

const cell = (state = Map({}), { type, value }) => {
  switch (type) {
    case 'CREATE_EMPTY_CELL':
      return Map({
        type: 'EMPTY',
        isFlagged: false,
        isVisible: false
      })

    case 'SET_CELL_BOMB':
      return state.get('type') === 'EMPTY'
        ? state.set('type', 'BOMB') : state

    case 'SET_CELL_NUMBER':
      return state.get('type') === 'EMPTY'
        ? state.set('type', 'NUMBER').set('value', value) : state

    case 'SET_CELL_VISIBLE':
      return !state.get('isFlagged')
        ? state.set('isVisible', true) : state

    case 'SET_CELL_FLAGGED':
      return !state.get('isVisible')
        ? state.update('isFlagged', v => !v) : state

    default:
      return state
  }
}

export default cell
