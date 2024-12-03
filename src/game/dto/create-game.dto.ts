export class CreateGameDto {
  playerOneUsername: string;
  playerOneShips: ShipConfig[];
}

export interface ShipConfig {
  name: string;
  length: number;
  startX: number;
  startY: number;
  isHorizontal: boolean;
  currentHits?: number;
}
