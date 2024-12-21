import { IsNumber, IsString, Min } from 'class-validator';

export class MakeMoveDto {
  @IsString()
  playerUsername: string;

  @IsNumber()
  @Min(0)
  x: number;

  @IsNumber()
  @Min(0)
  y: number;
}
