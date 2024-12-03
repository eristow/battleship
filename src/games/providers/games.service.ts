import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto, ShipConfig } from '../dto/create-game.dto';
import { Game, GameStatus, GameSummary } from '../entities/game.entity';
import { Board, CellState } from '../classes/board.class';
import { Ship } from '../classes/ship.class';
import { JoinGameDto } from '../dto/join-game.dto';
import {
  AttackOutcome,
  MoveResult,
  ShipInfo,
} from '../classes/move-result.class';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GamesService {
  constructor(
    private configService: ConfigService,

    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async getAllGames(): Promise<GameSummary[]> {
    const allGames = await this.gameRepository.find({
      relations: ['playerOne', 'playerTwo'],
    });

    return allGames.map((game) => ({
      id: game.id,
      playerOne: game.playerOne.username,
      playerTwo: game.playerTwo?.username,
      status: game.status,
      createdAt: game.createdAt,
    }));
  }

  async getGameById(gameId: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne', 'playerTwo'],
    });

    if (!game) {
      throw new BadRequestException('Game not found');
    }

    return game;
  }

  async deleteGame(gameId: string): Promise<boolean> {
    const deleteResult = await this.gameRepository.delete(gameId);

    return deleteResult.affected !== 0;
  }

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    const boardPlayerOne = new Board(this.configService.get('BOARD_SIZE'));

    const playerOneShipsPlaced = this.placeShips(
      createGameDto.playerOneShips,
      boardPlayerOne,
    );

    if (!playerOneShipsPlaced) {
      // TODO: make this return what ships are invalid and how they are
      throw new BadRequestException('Invalid ship placement for Player One');
    }

    const game = this.gameRepository.create({
      playerOne: { username: createGameDto.playerOneUsername },
      status: GameStatus.WAITING_FOR_PLAYER_TWO,
      playerOneBoard: boardPlayerOne,
    });

    const createdGame = this.gameRepository.save(game);

    return createdGame;
  }

  async joinGame(gameId: string, joinGameDto: JoinGameDto): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne'],
    });

    if (!game) {
      throw new BadRequestException('Game not found');
    }

    if (game.status !== GameStatus.WAITING_FOR_PLAYER_TWO) {
      throw new BadRequestException('Game already has two players');
    }

    const boardPlayerTwo = new Board(game.playerOneBoard.size);

    const playerTwoShipsPlaced = this.placeShips(
      joinGameDto.playerTwoShips,
      boardPlayerTwo,
    );

    if (!playerTwoShipsPlaced) {
      throw new BadRequestException('Invalid ship placement for player two');
    }

    const updateResult = await this.gameRepository.update(gameId, {
      playerTwo: { username: joinGameDto.playerTwoUsername },
      playerTwoBoard: boardPlayerTwo,
      status: GameStatus.PLAYER_ONE_TURN,
    });

    if (updateResult.affected === 0) {
      throw new BadRequestException('Failed to join game');
    }

    return await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne', 'playerTwo'],
    });
  }

  placeShips(shipConfig: ShipConfig[], targetBoard: Board): boolean {
    return shipConfig.every((shipConfig) => {
      const ship = new Ship(
        shipConfig.name,
        shipConfig.length,
        shipConfig.startX,
        shipConfig.startY,
        shipConfig.isHorizontal,
        shipConfig.currentHits,
      );

      return targetBoard.placeShip(ship);
    });
  }

  async makeMove(
    gameId: string,
    playerUsername: string,
    x: number,
    y: number,
  ): Promise<MoveResult> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne', 'playerTwo'],
    });

    if (!game) {
      throw new BadRequestException('Game not found');
    }

    this.validateMove(game, playerUsername, x, y);

    const isPlayerOneAttacking = game.playerOne.username === playerUsername;
    const targetBoard = isPlayerOneAttacking
      ? game.playerTwoBoard
      : game.playerOneBoard;

    const cellState = targetBoard.receiveAttack(x, y);

    let outcome: AttackOutcome;
    let sunkShip: ShipInfo | undefined;

    switch (cellState) {
      case CellState.MISS:
        outcome = AttackOutcome.MISS;
        break;
      case CellState.HIT:
        outcome = AttackOutcome.HIT;
        break;
      case CellState.SUNK:
        outcome = AttackOutcome.SUNK;
        sunkShip = this.findSunkShip(targetBoard, x, y);
        break;
      default:
        throw new BadRequestException('Invalid attack result');
    }

    const isGameOver = this.checkGameOver(targetBoard);
    const winnerId = isGameOver ? playerUsername : undefined;

    const moveResult = new MoveResult(
      outcome,
      playerUsername,
      x,
      y,
      sunkShip,
      isGameOver,
      winnerId,
    );

    await this.updateGameState(game, moveResult);

    return moveResult;
  }

  private validateMove(
    game: Game,
    playerUsername: string,
    x: number,
    y: number,
  ): void {
    if (
      game.playerOne.username !== playerUsername &&
      game.playerTwo.username !== playerUsername
    ) {
      throw new BadRequestException('Invalid player id');
    }

    const isPlayerOneAttacking = game.playerOne.username === playerUsername;
    if (isPlayerOneAttacking && game.status !== GameStatus.PLAYER_ONE_TURN) {
      throw new BadRequestException("Not player one's turn");
    }
    if (!isPlayerOneAttacking && game.status !== GameStatus.PLAYER_TWO_TURN) {
      throw new BadRequestException("Not player two's turn");
    }

    if (
      x < 0 ||
      x >= game.playerOneBoard.size ||
      y < 0 ||
      y >= game.playerOneBoard.size
    ) {
      throw new BadRequestException('Invalid attack coordinates');
    }
  }

  private findSunkShip(
    board: Board,
    attackX: number,
    attackY: number,
  ): ShipInfo {
    // TODO: Implement this method
    console.log(`findSunkShip: ${board} ${attackX} ${attackY}`);
    return {
      name: '',
      length: 0,
      isSunk: false,
    };
  }

  private checkGameOver(targetBoard: Board): boolean {
    return targetBoard.checkGameOver();
  }

  private async updateGameState(
    game: Game,
    moveResult: MoveResult,
  ): Promise<void> {
    if (moveResult.isGameOver) {
      game.status =
        moveResult.winnerId === game.playerOne.username
          ? GameStatus.PLAYER_ONE_WIN
          : GameStatus.PLAYER_TWO_WIN;
    } else {
      game.status =
        game.status === GameStatus.PLAYER_ONE_TURN
          ? GameStatus.PLAYER_TWO_TURN
          : GameStatus.PLAYER_ONE_TURN;
    }

    await this.gameRepository.save(game);
  }
}
