import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GamesService } from '../providers/games.service';
import { CreateGameDto } from '../dto/create-game.dto';
import { JoinGameDto } from '../dto/join-game.dto';
import { Game, GameSummary } from '../entities/game.entity';
import { MakeMoveDto } from '../dto/make-move.dto';
import { MoveResult } from '../classes/move-result.class';
import { ShipSummary } from '../classes/ship.class';

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @Get()
  async getAllGames(): Promise<GameSummary[]> {
    return this.gameService.getAllGames();
  }

  @Get('ships')
  getValidShips(): ShipSummary[] {
    return this.gameService.getValidShips();
  }

  @Get(':gameId')
  async getGameById(
    @Param('gameId', new ParseUUIDPipe()) gameId: string,
  ): Promise<Game> {
    return this.gameService.getGameById(gameId);
  }

  @Delete(':gameId')
  @HttpCode(204)
  async deleteGame(
    @Param('gameId', new ParseUUIDPipe()) gameId: string,
  ): Promise<void> {
    const deletedGame = await this.gameService.deleteGame(gameId);

    if (!deletedGame) {
      throw new BadRequestException('Failed to delete game');
    }
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
      moveDto.playerUsername,
      moveDto.x,
      moveDto.y,
    );
  }
}
