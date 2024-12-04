import { ShipInfo } from './move-result.class';
import { Ship, ShipData } from './ship.class';

export enum CellState {
  EMPTY,
  MISS,
  HIT,
  SUNK,
}

export interface BoardConfig {
  size: number;
  grid: CellState[][];
  ships: ShipData[];
}

export class Board {
  private grid: CellState[][];
  private ships: Ship[] = [];
  private shipsByCoordinate: Map<string, Ship> = new Map();

  constructor(public size: number) {
    this.initializeGrid(size);
  }

  // Returns if the desired placement is valid.
  placeShip(ship: Ship): { valid: boolean; error?: string } {
    const { valid, error } = this.isValidPlacement(ship);
    if (!valid) {
      return { valid, error };
    }

    this.ships.push(ship);

    ship.coordinates.forEach((coord) => {
      this.shipsByCoordinate.set(coord, ship);
    });

    return { valid };
  }

  receiveAttack(
    x: number,
    y: number,
  ): { cellState: CellState; isRepeatHit: boolean; sunkShip: ShipInfo } {
    const coord = `${x},${y}`;
    const ship = this.shipsByCoordinate.get(coord);

    // console.log('coord', coord);
    // console.log('ship', JSON.stringify(ship));
    // console.log('this.grid[y][x]', this.grid[y][x]);

    // Determine if this is a repeat hit
    if (this.grid[y][x] !== CellState.EMPTY) {
      // console.log('REPEAT HIT');
      return {
        cellState: CellState.MISS,
        isRepeatHit: true,
        sunkShip: undefined,
      };
    }

    // Determine if this is a miss, hit, or sink
    if (!ship) {
      // console.log('MISS');
      this.grid[y][x] = CellState.MISS;
      // console.log('this.grid[y][x]', this.grid[y][x]);
      return {
        cellState: CellState.MISS,
        isRepeatHit: false,
        sunkShip: undefined,
      };
    }

    ship.hit();

    if (ship.isSunk()) {
      // console.log('SUNK');
      ship.coordinates.forEach((shipCoord) => {
        const [x, y] = shipCoord.split(',').map(Number);
        this.grid[y][x] = CellState.SUNK;
      });

      const shipInfo: ShipInfo = {
        name: ship.name,
        length: ship.length,
        isSunk: true,
      };
      return {
        cellState: CellState.SUNK,
        isRepeatHit: false,
        sunkShip: shipInfo,
      };
    }

    // console.log('HIT');
    this.grid[y][x] = CellState.HIT;
    return {
      cellState: CellState.HIT,
      isRepeatHit: false,
      sunkShip: undefined,
    };
  }

  checkGameOver(): boolean {
    return this.ships.every((ship) => ship.isSunk());
  }

  updateGrid(grid: CellState[][]): void {
    this.grid = grid;
  }

  toJSON(): BoardConfig {
    return {
      size: this.size,
      grid: this.grid,
      ships: this.ships.map((ship) => ({
        ...ship,
        isSunk: ship.isSunk(),
      })),
    };
  }

  private initializeGrid(size: number): void {
    this.grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => CellState.EMPTY),
    );
  }

  private isValidPlacement(ship: Ship): { valid: boolean; error?: string } {
    const shipOutOfBounds = ship.coordinates.some((coord) => {
      const [x, y] = coord.split(',').map(Number);
      return x < 0 || x >= this.size || y < 0 || y >= this.size;
    });

    let existingShip = undefined;
    const overlappingShips = ship.coordinates.some((coord) => {
      if (this.shipsByCoordinate.has(coord)) {
        existingShip = this.shipsByCoordinate.get(coord);
        return true;
      }

      return false;
    });

    const valid = !shipOutOfBounds && !overlappingShips;

    let error = undefined;
    if (shipOutOfBounds) {
      error = `${ship.name} out of bounds`;
    } else if (existingShip) {
      error = `${existingShip.name} already exists at coordinates: ${ship.coordinates.join('; ')}`;
    }

    return {
      valid,
      error,
    };
  }
}
