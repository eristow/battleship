import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from '../dto/create-game.dto';
import { Game, GameStatus } from '../entities/game.entity';
import { Board } from '../models/board.model';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    const game = this.gameRepository.create({
      playerOne: { id: createGameDto.playerOneId },
      status: GameStatus.SETUP,
      // TODO: move the default board size to a config service.
      board: new Board(createGameDto.boardSize || 10),
    });

    return this.gameRepository.save(game);
  }

  async joinGame(gameId: string, playerTwoId: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne'],
    });

    if (!game || game.playerTwo) {
      throw new BadRequestException(
        'Game not found or already has two players.',
      );
    }

    game.playerTwo = { id: playerTwoId };
    game.status = GameStatus.IN_PROGRESS;

    return this.gameRepository.save(game);
  }

  async makeMove(
    gameId: string,
    playerId: string,
    x: number,
    y: number,
  ): Promise<MoveResult> {
    // TODO: Implement this method
  }
}
