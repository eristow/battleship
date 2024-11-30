import { Ship } from '../game.class';

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

export class Board {
  private grid: Cell[][];
  private ships: Ship[];

  // TODO: move the default board size to a config service.
  constructor(size: number = 10) {
    this.initializeGrid(size);
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

  // Returns if the desired placement is valid.
  placeShip(
    ship: Ship,
    startX: number,
    startY: number,
    isHorizontal: boolean,
  ): boolean {
    // TODO: Implement this method.
    // const shipCells = this.getShipCells(ship, startX, startY, isHorizontal);
    // shipCells.forEach(({ x, y }) => {
    // 	this.grid[y][x].state = CellState.SHIP;
    // });
  }

  receiveAttack(x: number, y: number): CellState {
    // TODO: Implement this method.
  }
}
