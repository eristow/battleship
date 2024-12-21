import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from '../../testing/mock-type';
import { repositoryMockFactory } from '../../testing/repository-mock-factory';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { GamesController } from '../controllers/games.controller';
import { Game, GameStatus, GameSummary } from '../entities/game.entity';
import { GamesService } from './games.service';
import { ConfigModule } from '@nestjs/config';
import { Board } from '../classes/board.class';
import { CreateGameDto } from '../dto/create-game.dto';
import { ShipType } from '../dto/ship-config.dto';
import { Ship, ShipSummary } from '../classes/ship.class';
import { JoinGameDto } from '../dto/join-game.dto';
import { AttackOutcome, MoveResult } from '../classes/move-result.class';

describe('GamesService', () => {
  let service: GamesService;
  let gameRepositoryMock: MockType<Repository<Game>>;
  let userRepositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [GamesController],
      providers: [
        GamesService,
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

    service = module.get<GamesService>(GamesService);
    gameRepositoryMock = module.get(getRepositoryToken(Game));
    userRepositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(gameRepositoryMock).toBeDefined();
    expect(userRepositoryMock).toBeDefined();
  });

  describe('getAllGames', () => {
    it('should get all games', async () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.SETUP,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      const gameReturn: GameSummary = {
        id: '123',
        playerOne: game.playerOne.username,
        playerTwo: game.playerTwo.username,
        status: GameStatus.SETUP,
        createdAt: new Date(),
      };
      gameRepositoryMock.find.mockReturnValue([game]);

      const games = await service.getAllGames();

      expect(games).toStrictEqual([gameReturn]);
    });
  });

  describe('getGameById', () => {
    it('should get a game by id', async () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.SETUP,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      gameRepositoryMock.findOne.mockReturnValue(game);

      const gameResult = await service.getGameById('123');

      expect(gameResult).toStrictEqual(game);
    });
  });

  it('should throw when getting a game by id that does not exist', () => {
    gameRepositoryMock.findOne.mockReturnValue(null);

    expect(() => service.getGameById('123')).rejects.toThrow();
  });

  describe('getValidShips', () => {
    it('should get valid ships', () => {
      const ships = service.getValidShips();

      expect(ships).toStrictEqual([
        { name: 'Carrier', length: 5 },
        { name: 'Battleship', length: 4 },
        { name: 'Destroyer', length: 3 },
        { name: 'Submarine', length: 3 },
        { name: 'Patrol Boat', length: 2 },
      ]);
    });
  });

  describe('deleteGame', () => {
    it('should delete a game', async () => {
      gameRepositoryMock.delete.mockReturnValue({ affected: 1 });

      await expect(service.deleteGame('123')).resolves.toBe(true);
    });

    it('should return false if delete fails', async () => {
      gameRepositoryMock.delete.mockReturnValue({ affected: 0 });

      await expect(service.deleteGame('123')).resolves.toBe(false);
    });
  });

  describe('createGame', () => {
    it('should create a game', async () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: null,
        status: GameStatus.SETUP,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      const createGameDto: CreateGameDto = {
        playerOneUsername: 'playerOne',
        playerOneShips: [
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
          { name: ShipType.CARRIER, isHorizontal: true, startX: 1, startY: 1 },
          {
            name: ShipType.DESTROYER,
            isHorizontal: true,
            startX: 2,
            startY: 2,
          },
          {
            name: ShipType.PATROL_BOAT,
            isHorizontal: true,
            startX: 3,
            startY: 3,
          },
          {
            name: ShipType.SUBMARINE,
            isHorizontal: true,
            startX: 4,
            startY: 4,
          },
        ],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerOne' });
      gameRepositoryMock.create.mockReturnValue(game);
      gameRepositoryMock.save.mockReturnValue(game);

      const gameResult = await service.createGame(createGameDto);

      expect(gameResult).toStrictEqual(game);
    });

    it('should throw when creating a game with invalid user', () => {
      const createGameDto: CreateGameDto = {
        playerOneUsername: 'playerOne',
        playerOneShips: [],
      };
      userRepositoryMock.findOne.mockReturnValue(null);

      expect(() => service.createGame(createGameDto)).rejects.toThrow();
    });

    it('should throw when creating a game with missing ship types', () => {
      const createGameDto: CreateGameDto = {
        playerOneUsername: 'playerOne',
        playerOneShips: [],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerOne' });

      expect(() => service.createGame(createGameDto)).rejects.toThrow();
    });

    it('should throw when joining a game with duplicate ship types', () => {
      const createGameDto: CreateGameDto = {
        playerOneUsername: 'playerOne',
        playerOneShips: [
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 1,
            startY: 1,
          },
        ],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerOne' });

      expect(() => service.createGame(createGameDto)).rejects.toThrow();
    });

    it('should throw when creating a game with invalid ship placement', () => {
      const createGameDto: CreateGameDto = {
        playerOneUsername: 'playerOne',
        playerOneShips: [
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
          {
            name: ShipType.CARRIER,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
        ],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerOne' });

      expect(() => service.createGame(createGameDto)).rejects.toThrow();
    });
  });

  describe('joinGame', () => {
    it('should join a game', async () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: undefined,
        status: GameStatus.WAITING_FOR_PLAYER_TWO,
        playerOneBoard: new Board(10),
        playerTwoBoard: undefined,
        createdAt: new Date(),
      };
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'playerTwo',
        playerTwoShips: [
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
          { name: ShipType.CARRIER, isHorizontal: true, startX: 1, startY: 1 },
          {
            name: ShipType.DESTROYER,
            isHorizontal: true,
            startX: 2,
            startY: 2,
          },
          {
            name: ShipType.PATROL_BOAT,
            isHorizontal: true,
            startX: 3,
            startY: 3,
          },
          {
            name: ShipType.SUBMARINE,
            isHorizontal: true,
            startX: 4,
            startY: 4,
          },
        ],
      };
      gameRepositoryMock.findOne.mockReturnValue(game);
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerTwo' });

      const gameResult = await service.joinGame('123', joinGameDto);

      expect(gameResult).toStrictEqual(game);
    });

    it('should throw when joining a game with invalid user', () => {
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'playerTwo',
        playerTwoShips: [],
      };
      userRepositoryMock.findOne.mockReturnValue(null);

      expect(() => service.joinGame('123', joinGameDto)).rejects.toThrow();
    });

    it('should throw when creating a game with missing ship types', () => {
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'playerTwo',
        playerTwoShips: [],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerTwo' });

      expect(() => service.joinGame('123', joinGameDto)).rejects.toThrow();
    });

    it('should throw when joining a game with duplicate ship types', () => {
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'playerTwo',
        playerTwoShips: [
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 1,
            startY: 1,
          },
        ],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerTwo' });

      expect(() => service.joinGame('123', joinGameDto)).rejects.toThrow();
    });

    it('should throw when joining a game with invalid game id', () => {
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'playerTwo',
        playerTwoShips: [
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
          { name: ShipType.CARRIER, isHorizontal: true, startX: 1, startY: 1 },
          {
            name: ShipType.DESTROYER,
            isHorizontal: true,
            startX: 2,
            startY: 2,
          },
          {
            name: ShipType.PATROL_BOAT,
            isHorizontal: true,
            startX: 3,
            startY: 3,
          },
          {
            name: ShipType.SUBMARINE,
            isHorizontal: true,
            startX: 4,
            startY: 4,
          },
        ],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerTwo' });
      gameRepositoryMock.findOne.mockReturnValue(null);

      expect(() => service.joinGame('123', joinGameDto)).rejects.toThrow();
    });

    it('should throw when joining a game already with two players', () => {
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'playerTwo',
        playerTwoShips: [
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
          { name: ShipType.CARRIER, isHorizontal: true, startX: 1, startY: 1 },
          {
            name: ShipType.DESTROYER,
            isHorizontal: true,
            startX: 2,
            startY: 2,
          },
          {
            name: ShipType.PATROL_BOAT,
            isHorizontal: true,
            startX: 3,
            startY: 3,
          },
          {
            name: ShipType.SUBMARINE,
            isHorizontal: true,
            startX: 4,
            startY: 4,
          },
        ],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerTwo' });
      gameRepositoryMock.findOne.mockReturnValue({
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
      });

      expect(() => service.joinGame('123', joinGameDto)).rejects.toThrow();
    });

    it('should throw when joining a game with invalid ship placement', () => {
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'playerTwo',
        playerTwoShips: [
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
          {
            name: ShipType.CARRIER,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
        ],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerTwo' });

      expect(() => service.joinGame('123', joinGameDto)).rejects.toThrow();
    });

    it('should throw when failing to join a game', () => {
      const joinGameDto: JoinGameDto = {
        playerTwoUsername: 'playerTwo',
        playerTwoShips: [
          {
            name: ShipType.BATTLESHIP,
            isHorizontal: true,
            startX: 0,
            startY: 0,
          },
          { name: ShipType.CARRIER, isHorizontal: true, startX: 1, startY: 1 },
          {
            name: ShipType.DESTROYER,
            isHorizontal: true,
            startX: 2,
            startY: 2,
          },
          {
            name: ShipType.PATROL_BOAT,
            isHorizontal: true,
            startX: 3,
            startY: 3,
          },
          {
            name: ShipType.SUBMARINE,
            isHorizontal: true,
            startX: 4,
            startY: 4,
          },
        ],
      };
      userRepositoryMock.findOne.mockReturnValue({ username: 'playerTwo' });
      gameRepositoryMock.findOne.mockReturnValue({
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
      });

      expect(() => service.joinGame('123', joinGameDto)).rejects.toThrow();
    });
  });

  describe('placeShips', () => {
    it('should place ships', () => {
      const shipConfig: ShipSummary[] = [
        {
          name: ShipType.BATTLESHIP,
          length: 4,
        },
      ];
      const targetBoard = new Board(10);

      const { valid, error } = service.placeShips(shipConfig, targetBoard);

      expect(valid).toBe(true);
      expect(error).toBeUndefined();
    });

    it('should return error when ship placement is invalid', () => {
      const shipConfig: ShipSummary[] = [
        {
          name: ShipType.BATTLESHIP,
          length: 4,
          startX: 10,
          startY: 10,
          isHorizontal: true,
        },
      ];
      const targetBoard = new Board(10);

      const { valid, error } = service.placeShips(shipConfig, targetBoard);

      expect(valid).toBe(false);
      expect(error).toBe(
        `Invalid ship placement: ${ShipType.BATTLESHIP}. ${ShipType.BATTLESHIP} out of bounds.`,
      );
    });
  });

  describe('makeMove', () => {
    it('should make a move for playerOne', async () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.PLAYER_ONE_TURN,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      const moveResult = new MoveResult(
        AttackOutcome.MISS,
        'playerOne',
        0,
        0,
        undefined,
        true,
        'playerOne',
      );
      gameRepositoryMock.findOne.mockReturnValue(game);

      const result = await service.makeMove('123', 'playerOne', 0, 0);

      expect(result).toStrictEqual(moveResult);
    });

    it('should make a move for playerTwo', async () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.PLAYER_TWO_TURN,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      const moveResult = new MoveResult(
        AttackOutcome.MISS,
        'playerTwo',
        0,
        0,
        undefined,
        true,
        'playerTwo',
      );
      gameRepositoryMock.findOne.mockReturnValue(game);

      const result = await service.makeMove('123', 'playerTwo', 0, 0);

      expect(result).toStrictEqual(moveResult);
    });

    it('should throw when game id is invalid', () => {
      gameRepositoryMock.findOne.mockReturnValue(null);

      expect(() =>
        service.makeMove('123', 'playerOne', 0, 0),
      ).rejects.toThrow();
    });

    it('should throw when repeat hit', () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.PLAYER_ONE_TURN,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      gameRepositoryMock.findOne.mockReturnValue(game);

      service.makeMove('123', 'playerOne', 0, 0);
      service.makeMove('123', 'playerTwo', 0, 0);
      game.playerOneBoard.placeShip(
        new Ship(ShipType.BATTLESHIP, 4, 0, 0, true),
      );
      game.playerTwoBoard.placeShip(
        new Ship(ShipType.BATTLESHIP, 4, 0, 0, true),
      );

      expect(() =>
        service.makeMove('123', 'playerOne', 0, 0),
      ).rejects.toThrow();
    });

    // TODO: fix this test
    // it('should throw when attack result is invalid', () => {
    //   const game: Game = {
    //     id: '123',
    //     playerOne: { username: 'playerOne' },
    //     playerTwo: { username: 'playerTwo' },
    //     status: GameStatus.PLAYER_ONE_TURN,
    //     playerOneBoard: new Board(10),
    //     playerTwoBoard: new Board(10),
    //     createdAt: new Date(),
    //   };
    //   gameRepositoryMock.findOne.mockReturnValue(game);
    //   game.playerOneBoard.receiveAttack = jest.fn(() => ({
    //     cellState: CellState.EMPTY,
    //     isRepeatHit: false,
    //     sunkShip: undefined,
    //   }));

    //   expect(() =>
    //     service.makeMove('123', 'playerOne', 0, 0),
    //   ).rejects.toThrow();
    // });

    it('should throw when game is not ready', () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.SETUP,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      gameRepositoryMock.findOne.mockReturnValue(game);

      expect(() =>
        service.makeMove('123', 'playerOne', 0, 0),
      ).rejects.toThrow();
    });

    it('should throw when game is over', () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.PLAYER_ONE_WIN,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      gameRepositoryMock.findOne.mockReturnValue(game);

      expect(() =>
        service.makeMove('123', 'playerOne', 0, 0),
      ).rejects.toThrow();
    });

    it('should throw when player is not in the game', () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.PLAYER_ONE_TURN,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      gameRepositoryMock.findOne.mockReturnValue(game);

      expect(() =>
        service.makeMove('123', 'playerThree', 0, 0),
      ).rejects.toThrow();
    });

    it("should throw when not playerOne's turn", () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.PLAYER_TWO_TURN,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      gameRepositoryMock.findOne.mockReturnValue(game);

      expect(() =>
        service.makeMove('123', 'playerOne', 0, 0),
      ).rejects.toThrow();
    });

    it("should throw when not playerTwo's turn", () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.PLAYER_ONE_TURN,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      gameRepositoryMock.findOne.mockReturnValue(game);

      expect(() =>
        service.makeMove('123', 'playerTwo', 0, 0),
      ).rejects.toThrow();
    });

    it('should throw when coordinates are invalid', () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.PLAYER_ONE_TURN,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      gameRepositoryMock.findOne.mockReturnValue(game);

      expect(() =>
        service.makeMove('123', 'playerOne', 10, 10),
      ).rejects.toThrow();
    });

    it('should switch turns after a successful attack', async () => {
      const game: Game = {
        id: '123',
        playerOne: { username: 'playerOne' },
        playerTwo: { username: 'playerTwo' },
        status: GameStatus.PLAYER_ONE_TURN,
        playerOneBoard: new Board(10),
        playerTwoBoard: new Board(10),
        createdAt: new Date(),
      };
      gameRepositoryMock.findOne.mockReturnValue(game);
      game.playerOneBoard.placeShip(
        new Ship(ShipType.BATTLESHIP, 4, 0, 0, true),
      );
      game.playerTwoBoard.placeShip(
        new Ship(ShipType.BATTLESHIP, 4, 0, 0, true),
      );

      await service.makeMove('123', 'playerOne', 0, 0);

      expect(game.status).toBe(GameStatus.PLAYER_TWO_TURN);

      await service.makeMove('123', 'playerTwo', 0, 0);

      expect(game.status).toBe(GameStatus.PLAYER_ONE_TURN);
    });
  });
});
