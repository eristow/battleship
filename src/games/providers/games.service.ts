import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from '../dto/create-game.dto';
import { Game, GameStatus, GameSummary } from '../entities/game.entity';
import { Board, CellState } from '../classes/board.class';
import { Ship, ShipSummary } from '../classes/ship.class';
import { JoinGameDto } from '../dto/join-game.dto';
import { AttackOutcome, MoveResult } from '../classes/move-result.class';
import { ConfigService } from '@nestjs/config';
import { SHIP_LENGTHS, ShipConfig, ShipType } from '../dto/ship-config.dto';

interface ShipValidationResult {
  isValid: boolean;
  error?: string;
}

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

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

  getValidShips(): ShipSummary[] {
    return Object.entries(SHIP_LENGTHS).map(([name, length]) => ({
      name: name as ShipType,
      length,
    }));
  }

  async deleteGame(gameId: string): Promise<boolean> {
    const deleteResult = await this.gameRepository.delete(gameId);

    return deleteResult.affected !== 0;
  }

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    const validation = this.validateShipTypes(createGameDto.playerOneShips);
    if (!validation.isValid) {
      throw new BadRequestException(validation.error);
    }

    const shipsWithLengths = createGameDto.playerOneShips.map(
      (ship) =>
        ({
          ...ship,
          length: SHIP_LENGTHS[ship.name],
        }) as ShipSummary,
    );

    const boardPlayerOne = new Board(this.configService.get('BOARD_SIZE'));

    const playerOneShipsPlaced = this.placeShips(
      shipsWithLengths,
      boardPlayerOne,
    );

    if (!playerOneShipsPlaced.valid || playerOneShipsPlaced.error) {
      throw new BadRequestException(playerOneShipsPlaced.error);
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
    const validation = this.validateShipTypes(joinGameDto.playerTwoShips);
    if (!validation.isValid) {
      throw new BadRequestException(validation.error);
    }

    const shipsWithLengths = joinGameDto.playerTwoShips.map(
      (ship) =>
        ({
          ...ship,
          length: SHIP_LENGTHS[ship.name],
        }) as ShipSummary,
    );
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
      shipsWithLengths,
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

  private validateShipTypes(ships: ShipConfig[]): ShipValidationResult {
    const shipCounts = new Map<ShipType, number>();

    for (const ship of ships) {
      shipCounts.set(ship.name, (shipCounts.get(ship.name) || 0) + 1);
    }

    // Check for duplicates
    const duplicates = Array.from(shipCounts.entries())
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, count]) => count > 1)
      .map(([type]) => type);

    if (duplicates.length > 0) {
      return {
        isValid: false,
        error: `Duplicate ships found: ${duplicates.join(', ')}`,
      };
    }

    // Check for missing types
    const missingTypes = Object.values(ShipType).filter(
      (type) => !shipCounts.has(type),
    );

    if (missingTypes.length > 0) {
      return {
        isValid: false,
        error: `Missing ship types: ${missingTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  placeShips(
    shipConfig: ShipSummary[],
    targetBoard: Board,
  ): { valid: boolean; error?: string } {
    let invalidShip = null;
    let errorDetails = '';

    const shipPlaced = shipConfig.every((shipConfig) => {
      const ship = new Ship(
        shipConfig.name,
        shipConfig.length,
        shipConfig.startX,
        shipConfig.startY,
        shipConfig.isHorizontal,
      );

      const { valid, error } = targetBoard.placeShip(ship);

      if (!valid) {
        invalidShip = ship;
        errorDetails = error;
      }
      return valid;
    });

    return {
      valid: shipPlaced,
      error:
        invalidShip && errorDetails
          ? `Invalid ship placement: ${invalidShip.name}. ${errorDetails}.`
          : undefined,
    };
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

    const { cellState, isRepeatHit, sunkShip } = targetBoard.receiveAttack(
      x,
      y,
    );

    if (isRepeatHit) {
      throw new BadRequestException('Repeat hit');
    }

    let outcome: AttackOutcome;

    switch (cellState) {
      case CellState.MISS:
        outcome = AttackOutcome.MISS;
        break;
      case CellState.HIT:
        outcome = AttackOutcome.HIT;
        break;
      case CellState.SUNK:
        outcome = AttackOutcome.SUNK;
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
      game.status === GameStatus.PLAYER_ONE_WIN ||
      game.status === GameStatus.PLAYER_TWO_WIN
    ) {
      throw new BadRequestException('Game is over');
    }

    if (game.status === GameStatus.WAITING_FOR_PLAYER_TWO) {
      throw new BadRequestException('Game is not ready');
    }

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
