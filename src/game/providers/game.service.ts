import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto, ShipConfig } from '../dto/create-game.dto';
import { Game, GameStatus } from '../entities/game.entity';
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
export class GameService {
  constructor(
    private configService: ConfigService,

    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async getAllGames(): Promise<Game[]> {
    return await this.gameRepository.find();
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
      playerOne: { id: createGameDto.playerOneId },
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

    if (game.playerTwo) {
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
      playerTwo: { id: joinGameDto.playerTwoId },
      playerTwoBoard: boardPlayerTwo,
      status: GameStatus.PLAYER_ONE_TURN,
    });

    console.log(JSON.stringify(updateResult));

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
    playerId: string,
    x: number,
    y: number,
  ): Promise<MoveResult> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne', 'playerTwo'],
    });

    this.validateMove(game, playerId, x, y);

    const isPlayerOneAttacking = game.playerOne.id === playerId;
    const targetBoard = isPlayerOneAttacking
      ? game.playerTwoBoard
      : game.playerOneBoard;

    console.log(JSON.stringify(targetBoard));

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
    const winnerId = isGameOver ? playerId : undefined;

    const moveResult = new MoveResult(
      outcome,
      playerId,
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
    playerId: string,
    x: number,
    y: number,
  ): void {
    if (game.playerOne.id !== playerId && game.playerTwo.id !== playerId) {
      throw new BadRequestException('Invalid player id');
    }

    const isPlayerOneAttacking = game.playerOne.id === playerId;
    if (isPlayerOneAttacking && game.status !== GameStatus.PLAYER_ONE_TURN) {
      throw new BadRequestException("Not player one's turn");
    }
    if (!isPlayerOneAttacking && game.status !== GameStatus.PLAYER_TWO_TURN) {
      throw new BadRequestException("Not player two's turn");
    }

    // TODO: change to use board size from config service
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
    console.log(`${board} ${attackX} ${attackY}`);
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
        moveResult.winnerId === game.playerOne.id
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
