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
export const createEmptyBoard = (width = 10, height = 10) => ({
  type: 'CREATE_EMPTY_BOARD',
  width,
  height
})

export const updateCell = (x, y, cellAction) => ({
  type: 'UPDATE_CELL',
  x,
  y,
  cellAction
})

export const placeBombs = (count = 0) => ({
  type: 'PLACE_BOMBS',
  count
})

export const calculateNumbers = () => ({
  type: 'CALCULATE_NUMBERS'
})

// Minesweeper actions
export const newGame = ({width, height, bombs, text}) => ({
  type: 'NEW_GAME',
  width,
  height,
  bombs,
  text
})

export const leftClick = (x, y) => ({
  type: 'LEFT_CLICK',
  x,
  y
})

export const rightClick = (x, y) => ({
  type: 'RIGHT_CLICK',
  x,
  y
})
