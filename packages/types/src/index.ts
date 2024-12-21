export enum ShipType {
  CARRIER = 'Carrier',
  BATTLESHIP = 'Battleship',
  SUBMARINE = 'Submarine',
  DESTROYER = 'Destroyer',
  PATROL_BOAT = 'Patrol Boat',
}

export interface ShipSummary {
  name: ShipType;
  length: number;
  startX?: number;
  startY?: number;
  isHorizontal?: boolean;
  currentHits?: number;
}
