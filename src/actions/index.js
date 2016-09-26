// Cell actions
export const createEmptyCell = () => ({
  type: 'CREATE_EMPTY_CELL'
})

export const setCellBomb = () => ({
  type: 'SET_CELL_BOMB'
})

export const setCellNumber = (value) => ({
  type: 'SET_CELL_NUMBER',
  value
})

export const setCellVisible = () => ({
  type: 'SET_CELL_VISIBLE'
})

export const setCellFlagged = () => ({
  type: 'SET_CELL_FLAGGED'
})

// Board actions
export const createEmptyBoard = (width, height) => ({
  type: 'CREATE_EMPTY_BOARD',
  width,
  height
})
