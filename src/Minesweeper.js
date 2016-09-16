import * as R from 'ramda'


function Minesweeper(width = 10, height = 10) {
	this.board = R.range(0, height)
		.map(row => R.range(0, width)
			.map(el => 0))
}


const NewGame = (w, h) => new Minesweeper(w, h)


export { NewGame }
