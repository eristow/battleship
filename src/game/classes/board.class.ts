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

export class Board {
  private grid: Cell[][];
  private ships: Ship[];

  constructor(public size: number) {
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
    console.log(
      `placeShip: ${JSON.stringify(ship)} ${startX} ${startY} ${isHorizontal}`,
    );
    return true;
  }

  receiveAttack(x: number, y: number): CellState {
    // TODO: Implement this method.
    console.log(`${x} ${y}`);
    return CellState.EMPTY;
  }

  checkGameOver(): boolean {
    return this.ships.every((ship) => ship.isSunk());
  }
}
