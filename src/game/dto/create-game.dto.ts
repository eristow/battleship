export class CreateGameDto {
  playerOneId: string;
  boardSize?: number;
  playerOneShips: ShipConfig[];
}

export interface ShipConfig {
  name: string;
  count: number;
  length: number;
}
