import { ShipConfig } from './create-game.dto';

export class JoinGameDto {
  playerTwoId: string;
  playerTwoShips: ShipConfig[];
}
