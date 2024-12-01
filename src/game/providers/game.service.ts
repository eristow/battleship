import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from '../dto/create-game.dto';
import { Game, GameStatus } from '../entities/game.entity';
import { Board, CellState } from '../models/board.model';
import { Ship } from '../models/ship.model';
import { JoinGameDto } from '../dto/join-game.dto';
import {
  AttackOutcome,
  MoveResult,
  ShipInfo,
} from '../models/move-result.model';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async getAllGames(): Promise<Game[]> {
    return await this.gameRepository.find();
  }

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    // TODO: move the default board size to a config service.
    const board1 = new Board(createGameDto.boardSize || 10);
    const board2 = new Board(createGameDto.boardSize || 10);

    // TODO: extract ship validation into a separate function
    const playerOneShipsPlaced = createGameDto.playerOneShips.every(
      (shipConfig) => {
        const ship = new Ship(shipConfig.name, shipConfig.length);
        console.log('New ship:');
        console.table(ship);

        const shipPlaced = board1.placeShip(
          ship,
          shipConfig.startX,
          shipConfig.startY,
          shipConfig.isHorizontal,
        );

        console.log(`shipPlaced: ${shipPlaced}`);

        return shipPlaced;
      },
    );

    if (!playerOneShipsPlaced) {
      // TODO: make this return what ships are invalid and how they are
      throw new BadRequestException('Invalid ship placement for Player One');
    }

    // TODO: fix error
    /*
      UpdateValuesMissingError: Cannot perform update query because update values are not defined. Call "qb.set(...)" method to specify updated values.
    */
    const game = this.gameRepository.create({
      playerOne: { id: createGameDto.playerOneId },
      playerTwo: {},
      status: GameStatus.WAITING_FOR_PLAYER_TWO,
      playerOneBoard: board1,
      playerTwoBoard: board2,
      playerOneShips: createGameDto.playerOneShips,
      playerTwoShips: [],
    });

    return this.gameRepository.save(game);
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

    // TODO: extract ship validation into a separate function
    const playerTwoShipsPlaced = joinGameDto.playerTwoShips.every(
      (shipConfig) => {
        const ship = new Ship(shipConfig.name, shipConfig.length);

        return boardPlayerTwo.placeShip(
          ship,
          shipConfig.startX,
          shipConfig.startY,
          shipConfig.isHorizontal,
        );
      },
    );

    if (!playerTwoShipsPlaced) {
      throw new BadRequestException('Invalid ship placement for player two');
    }

    // TODO: do I need to give the username here, or can I pull it from the User DB?
    game.playerTwo = { id: joinGameDto.playerTwoId, username: '' };
    game.playerTwoBoard = boardPlayerTwo;
    game.playerTwoShips = joinGameDto.playerTwoShips;
    game.status = GameStatus.IN_PROGRESS;

    return this.gameRepository.save(game);
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
    // TODO: implement this method
    console.log(`${game} ${playerId} ${x} ${y}`);
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

  private checkGameOver(board: Board): boolean {
    // TODO: Implement this method
    console.log(`${board}`);
    return false;
  }

  private async updateGameState(
    game: Game,
    moveResult: MoveResult,
  ): Promise<void> {
    // TODO: implement this method
    console.log(`${game} ${moveResult}`);
  }
}
