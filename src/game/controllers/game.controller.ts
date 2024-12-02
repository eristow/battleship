import {
  BadRequestException,
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
import { MoveResult } from '../classes/move-result.class';

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
    const createdGame = await this.gameService.createGame(createGameDto);

    if (!createdGame) {
      throw new BadRequestException('Failed to create game');
    }

    return createdGame;
  }

  @Post(':gameId/join')
  @UsePipes(new ValidationPipe())
  async joinGame(
    @Param('gameId', new ParseUUIDPipe()) gameId: string,
    @Body() joinGameDto: JoinGameDto,
  ): Promise<Game> {
    const joinedGame = this.gameService.joinGame(gameId, joinGameDto);

    if (!joinedGame) {
      throw new BadRequestException('Failed to join game');
    }

    return joinedGame;
  }

  @Post(':gameId/move')
  @UsePipes(new ValidationPipe())
  async makeMove(
    @Param('gameId', new ParseUUIDPipe()) gameId: string,
    @Body() moveDto: MakeMoveDto,
  ): Promise<MoveResult> {
    return this.gameService.makeMove(
      gameId,
      moveDto.playerId,
      moveDto.x,
      moveDto.y,
    );
  }
}
