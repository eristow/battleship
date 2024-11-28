// Purpose: Manages the game of Battleship.
interface Coordinates {
  x: number;
  y: number;
}

export class Game {
  board: Board;
  players: Player[];
  currentPlayer: Player;
}

export class Board {
  gridPlayer1: number[][];
  gridPlayer2: number[][];
  /*
		0 = empty
		letter = ship
		2 = hit
		3 = miss
	*/
  shipsPlayer1: Ship[];
  shipsPlayer2: Ship[];
  /*
		c = carrier (5)
		b = battleship (4)
		d = destroyer (3)
		s = submarine (3)
		p = patrol boat (2)
	*/
}

export class Ship {
  name: string;
  length: number;
  currentHealth: number;
  coordinates: Coordinates[];
  isSunk: boolean;
}

export class Player {
  name: string;
  ships: Ship[];
  shots: Coordinates[];
  hits: Coordinates[];
  misses: Coordinates[];
}
