import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from '../providers/game.service';
import { CreateGameDto } from '../dto/create-game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(createGameDto);
  }

  @Post(':gameId/join')
  async joinGame(
    @Param('gameId') gameId: string,
    @Body('playerTwoId') playerTwoId: string,
  ) {
    return this.gameService.joinGame(gameId, playerTwoId);
  }

  @Post(':gameId/move')
  async makeMove(
    @Param('gameId') gameId: string,
    @Body() moveDto: MakeMoveDto,
  ) {
    return this.gameService.makeMove(
      gameId,
      moveDto.playerId,
      moveDto.x,
      moveDto.y,
    );
  }
}
