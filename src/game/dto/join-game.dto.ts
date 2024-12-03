import { ShipConfig } from './create-game.dto';

export class JoinGameDto {
  playerTwoUsername: string;
  playerTwoShips: ShipConfig[];
}
