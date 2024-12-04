import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ShipConfigDto, ShipConfig } from './ship-config.dto';

export class JoinGameDto {
  @IsString()
  playerTwoUsername: string;

  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => ShipConfigDto)
  playerTwoShips: ShipConfig[];
}
