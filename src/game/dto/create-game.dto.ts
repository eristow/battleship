export class CreateGameDto {
  playerOneId: string;
  boardSize?: number;
  playerOneShips: ShipConfig[];
}

export interface ShipConfig {
  name: string;
  length: number;
  startX: number;
  startY: number;
  isHorizontal: boolean;
}
