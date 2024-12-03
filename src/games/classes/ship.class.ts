import { ShipType } from '../dto/ship-config.dto';

export interface ShipSummary {
  name: ShipType;
  length: number;
  startX?: number;
  startY?: number;
  isHorizontal?: boolean;
  currentHits?: number;
}

export interface ShipData extends ShipSummary {
  coordinates: string[];
  isSunk: boolean;
}

export class Ship implements ShipSummary {
  public coordinates: string[] = [];

  constructor(
    public name: ShipType,
    public length: number,
    public startX: number,
    public startY: number,
    public isHorizontal: boolean,
    public currentHits: number = 0,
  ) {
    this.calculateCoordinates();
  }

  private calculateCoordinates(): void {
    this.coordinates = [];

    for (let i = 0; i < this.length; i++) {
      const x = this.isHorizontal ? this.startX + i : this.startX;
      const y = this.isHorizontal ? this.startY : this.startY + i;
      this.coordinates.push(`${x},${y}`);
    }
  }

  hit(): void {
    this.currentHits++;
  }

  isSunk(): boolean {
    return this.currentHits === this.length;
  }
}
