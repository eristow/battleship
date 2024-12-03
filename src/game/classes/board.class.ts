import { Ship } from './ship.class';

export enum CellState {
  EMPTY,
  SHIP,
  MISS,
  HIT,
  SUNK,
}

export interface BoardConfig {
  size: number;
  grid: CellState[][];
  ships: Ship[];
}

export class Board {
  private grid: CellState[][];
  private ships: Ship[] = [];
  private shipsByCoordinate: Map<string, Ship> = new Map();

  constructor(public size: number) {
    this.initializeGrid(size);
  }

  // Returns if the desired placement is valid.
  placeShip(ship: Ship): boolean {
    if (!this.isValidPlacement(ship)) {
      return false;
    }

    this.ships.push(ship);

    ship.coordinates.forEach((coord) => {
      this.shipsByCoordinate.set(coord, ship);

      const [x, y] = coord.split(',').map(Number);
      this.grid[y][x] = CellState.SHIP;
    });

    return true;
  }

  receiveAttack(x: number, y: number): CellState {
    const coord = `${x},${y}`;
    const ship = this.shipsByCoordinate.get(coord);

    if (!ship) {
      this.grid[y][x] = CellState.MISS;
      return CellState.MISS;
    }

    ship.hit();

    if (ship.isSunk()) {
      ship.coordinates.forEach((shipCoord) => {
        const [x, y] = shipCoord.split(',').map(Number);
        this.grid[y][x] = CellState.SUNK;
      });
      return CellState.SUNK;
    }

    this.grid[y][x] = CellState.HIT;
    return CellState.HIT;
  }

  checkGameOver(): boolean {
    return this.ships.every((ship) => ship.isSunk());
  }

  toJSON(): BoardConfig {
    return {
      size: this.size,
      grid: this.grid,
      ships: this.ships,
    };
  }

  private initializeGrid(size: number): void {
    this.grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => CellState.EMPTY),
    );
  }

  private isValidPlacement(ship: Ship): boolean {
    return ship.coordinates.every((coord) => {
      const [x, y] = coord.split(',').map(Number);

      return (
        x >= 0 &&
        x < this.size &&
        y >= 0 &&
        y < this.size &&
        this.grid[y][x] === CellState.EMPTY
      );
    });
  }
}
