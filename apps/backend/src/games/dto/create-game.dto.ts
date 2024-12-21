import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShipConfig, ShipConfigDto } from './ship-config.dto';

export class CreateGameDto {
  @IsString()
  playerOneUsername: string;

  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => ShipConfigDto)
  playerOneShips: ShipConfig[];
}
