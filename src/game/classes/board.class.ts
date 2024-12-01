import { Ship } from './ship.class';

export enum CellState {
  EMPTY,
  SHIP,
  MISS,
  HIT,
  SUNK,
}

export interface Cell {
  x: number;
  y: number;
  state: CellState;
}

export interface BoardConfig {
  size: number;
  grid: Cell[][];
  ships: Ship[];
}

export class Board {
  private grid: Cell[][];
  private ships: Ship[];

  constructor(public size: number) {
    this.initializeGrid(size);
  }

  toJSON(): BoardConfig {
    return {
      size: this.size,
      grid: this.grid,
      ships: this.ships,
    };
  }

  // Returns if the desired placement is valid.
  placeShip(
    ship: Ship,
    startX: number,
    startY: number,
    isHorizontal: boolean,
  ): boolean {
    // TODO: Implement this method.
    console.log(
      `placeShip: ${JSON.stringify(ship)} ${startX} ${startY} ${isHorizontal}`,
    );
    return true;
  }

  receiveAttack(x: number, y: number): CellState {
    const cell = this.grid[y][x];
    console.log(`receiveAttack: ${x} ${y} ${cell.state}`);

    switch (cell.state) {
      case CellState.EMPTY:
        cell.state = CellState.MISS;
        return CellState.MISS;
      case CellState.SHIP:
        cell.state = CellState.HIT;
        return CellState.HIT;
      default:
        return cell.state;
    }
  }

  checkGameOver(): boolean {
    return this.ships.every((ship) => ship.isSunk());
  }

  setGrid(grid: Cell[][]): void {
    this.grid = grid.map((row: Cell[]) =>
      row.map(
        (cell: Cell) =>
          ({
            x: cell.x,
            y: cell.y,
            state: cell.state,
          }) as Cell,
      ),
    );
  }

  setShips(ships: Ship[]): void {
    this.ships = ships.map(
      (ship: Ship) => new Ship(ship.name, ship.length, ship.getCurrentHits()),
    );
  }

  private initializeGrid(size: number): void {
    this.grid = Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => ({
        x,
        y,
        state: CellState.EMPTY,
      })),
    );
  }
}
