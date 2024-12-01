import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from '../providers/game.service';
import { CreateGameDto } from '../dto/create-game.dto';
import { JoinGameDto } from '../dto/join-game.dto';
import { Game } from '../entities/game.entity';
import { MakeMoveDto } from '../dto/make-move.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getAllGames(): Promise<Game[]> {
    return this.gameService.getAllGames();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(createGameDto);
  }

  @Post(':gameId/join')
  @UsePipes(new ValidationPipe())
  async joinGame(
    @Param('gameId', new ParseUUIDPipe()) gameId: string,
    @Body() joinGameDto: JoinGameDto,
  ) {
    return this.gameService.joinGame(gameId, joinGameDto);
  }

  @Post(':gameId/move')
  @UsePipes(new ValidationPipe())
  async makeMove(
    @Param('gameId', new ParseUUIDPipe()) gameId: string,
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
