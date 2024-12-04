import { IsEnum, IsNumber, Min, IsBoolean } from 'class-validator';

export enum ShipType {
  CARRIER = 'Carrier',
  BATTLESHIP = 'Battleship',
  SUBMARINE = 'Submarine',
  DESTROYER = 'Destroyer',
  PATROL_BOAT = 'Patrol Boat',
}

export const SHIP_LENGTHS: Record<ShipType, number> = {
  [ShipType.CARRIER]: 5,
  [ShipType.BATTLESHIP]: 4,
  [ShipType.DESTROYER]: 3,
  [ShipType.SUBMARINE]: 3,
  [ShipType.PATROL_BOAT]: 2,
};

export interface ShipConfig {
  name: ShipType;
  startX: number;
  startY: number;
  isHorizontal: boolean;
}

export class ShipConfigDto implements ShipConfig {
  @IsEnum(ShipType)
  name: ShipType;

  @IsNumber()
  @Min(0)
  startX: number;

  @IsNumber()
  @Min(0)
  startY: number;

  @IsBoolean()
  isHorizontal: boolean;
}
