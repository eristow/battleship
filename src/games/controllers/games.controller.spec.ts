import { MockType } from '../../testing/mock-type';
import { GamesService } from '../providers/games.service';
import { GamesController } from './games.controller';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Game, GameStatus, GameSummary } from '../entities/game.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../testing/repository-mock-factory';
import { Test, TestingModule } from '@nestjs/testing';
import { gamesServiceFactory } from '../../testing/games-service-mock-factory';
import { ShipSummary } from '../classes/ship.class';
import { ShipType } from '../dto/ship-config.dto';
import { Board } from '../classes/board.class';
import { CreateGameDto } from '../dto/create-game.dto';
import { JoinGameDto } from '../dto/join-game.dto';
import { MakeMoveDto } from '../dto/make-move.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ConfigModule } from '@nestjs/config';

describe('GamesController', () => {
  let controller: GamesController;
  let gameRepositoryMock: MockType<Repository<Game>>;
  let userRepositoryMock: MockType<Repository<User>>;
  let gameServiceMock: MockType<GamesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [GamesController],
      providers: [
        JwtService,
        AuthGuard,
        {
          provide: GamesService,
          useFactory: gamesServiceFactory,
        },
        {
          provide: getRepositoryToken(Game),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    gameRepositoryMock = module.get(getRepositoryToken(Game));
    userRepositoryMock = module.get(getRepositoryToken(User));
    gameServiceMock = module.get(GamesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(gameRepositoryMock).toBeDefined();
    expect(userRepositoryMock).toBeDefined();
    expect(gameServiceMock).toBeDefined();
  });

  describe('getAllGames', () => {
    it('should get all games', async () => {
      const gameSummary: GameSummary = {
        id: '123',
        playerOne: 'player1',
        playerTwo: 'player2',
        status: GameStatus.SETUP,
        createdAt: new Date(),
      };

      gameServiceMock.getAllGames.mockReturnValue([gameSummary]);

      const result = await controller.getAllGames();

      expect(result).toEqual([gameSummary]);
    });
  });

  describe('getValidShips', () => {
    it('should get valid ships', () => {
      const shipSummary: ShipSummary = {
        name: ShipType.BATTLESHIP,
        length: 5,
      };

      gameServiceMock.getValidShips.mockReturnValue([shipSummary]);

      const result = controller.getValidShips();

      expect(result).toEqual([shipSummary]);
    });
  });

  describe('getGameById', () => {
    it('should get game by id', async () => {
      const game: Game = {
        id: '123',
        playerOne: new User(),
        playerTwo: null,
        status: GameStatus.SETUP,
        playerOneBoard: new Board(10),
        playerTwoBoard: null,
        createdAt: new Date(),
      };

      gameServiceMock.getGameById.mockReturnValue(game);

      const result = await controller.getGameById('123');

      expect(result).toEqual(game);
    });
  });

  describe('deleteGame', () => {
    it('should delete game', () => {
      const gameId = '123';

      gameServiceMock.deleteGame.mockReturnValue(true);

      controller.deleteGame(gameId);

      expect(gameServiceMock.deleteGame).toHaveBeenCalledWith(gameId);
    });

    it('should throw when deleting game fails', async () => {
      const gameId = '123';

      gameServiceMock.deleteGame.mockReturnValue(false);

      await expect(controller.deleteGame(gameId)).rejects.toThrow(
        'Failed to delete game',
      );
    });
  });

  describe('createGame', () => {
    it('should create game', async () => {
      const createGameDto: CreateGameDto = {
        playerOneUsername: 'player1',
        playerOneShips: [],
      };

      const game: Game = {
        id: '123',
        playerOne: new User(),
        playerTwo: null,
        status: GameStatus.SETUP,
        playerOneBoard: new Board(10),
        playerTwoBoard: null,
        createdAt: new Date(),
      };

      gameServiceMock.createGame.mockReturnValue(game);

      const result = await controller.createGame(createGameDto);

      expect(result).toEqual(game);
    });

    it('should throw when creating game fails', async () => {
      const createGameDto: CreateGameDto = {
        playerOneUsername: 'player1',
        playerOneShips: [],
      };

      gameServiceMock.createGame.mockReturnValue(null);

      await expect(controller.createGame(createGameDto)).rejects.toThrow();
    });
  });

  describe('joinGame', () => {
    it('should join game', async () => {
      const gameId = '123';
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'player2',
        playerTwoShips: [],
      };

      const game: Game = {
        id: '123',
        playerOne: new User(),
        playerTwo: new User(),
        status: GameStatus.SETUP,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };

      gameServiceMock.joinGame.mockReturnValue(game);

      const result = await controller.joinGame(gameId, joinGameDto);

      expect(result).toEqual(game);
    });

    it('should throw when joining game fails', async () => {
      const gameId = '123';
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'player2',
        playerTwoShips: [],
      };

      gameServiceMock.joinGame.mockReturnValue(null);

      await expect(controller.joinGame(gameId, joinGameDto)).rejects.toThrow();
    });
  });

  describe('makeMove', () => {
    it('should make a move', () => {
      const gameId = '123';
      const move: MakeMoveDto = {
        playerUsername: 'player1',
        x: 1,
        y: 1,
      };

      gameServiceMock.makeMove.mockReturnValue(true);

      controller.makeMove(gameId, move);

      expect(gameServiceMock.makeMove).toHaveBeenCalledWith(
        gameId,
        move.playerUsername,
        move.x,
        move.y,
      );
    });
  });
});
