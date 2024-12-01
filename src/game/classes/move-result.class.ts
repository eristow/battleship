export enum AttackOutcome {
  MISS = 'MISS',
  HIT = 'HIT',
  SUNK = 'SUNK',
}

export interface ShipInfo {
  name: string;
  length: number;
  isSunk: boolean;
}

export class MoveResult {
  constructor(
    public outcome: AttackOutcome,
    public attackingPlayerId: string,
    public x: number,
    public y: number,
    public hitShip?: ShipInfo,
    public isGameOver: boolean = false,
    public winnerId?: string,
  ) {}

  getDescription(): string {
    switch (this.outcome) {
      case AttackOutcome.MISS:
        return `Missed at coordinates (${this.x}, ${this.y})`;
      case AttackOutcome.HIT:
        return `Hit ${this.hitShip?.name} at coordinates (${this.x}, ${this.y})`;
      case AttackOutcome.SUNK:
        return `Sunk ${this.hitShip?.name} at coordinates (${this.x}, ${this.y})`;
    }
  }
}
