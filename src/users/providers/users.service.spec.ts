import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../../games/entities/game.entity';
import { MockType } from '../../testing/mock-type';
import { repositoryMockFactory } from '../../testing/repository-mock-factory';
import { Repository } from 'typeorm';
import { UsersController } from '../controllers/users.controller';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { configServiceMock } from '../../testing/config-service-mock';

describe('UsersService', () => {
  let service: UsersService;
  let userRepositoryMock: MockType<Repository<User>>;
  let gameRepositoryMock: MockType<Repository<Game>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        configServiceMock,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Game),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepositoryMock = module.get(getRepositoryToken(User));
    gameRepositoryMock = module.get(getRepositoryToken(Game));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepositoryMock).toBeDefined();
    expect(gameRepositoryMock).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [{ username: 'test' }];

      userRepositoryMock.find.mockReturnValue(users);

      expect(await service.getAllUsers()).toEqual(users);
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user with the given username', async () => {
      const username = 'test';
      const user = { username: username };

      userRepositoryMock.findOne.mockReturnValue(user);

      expect(await service.getUserByUsername(username)).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = { username: 'test', password: 'password' };
      const user = { username: 'test', password: 'password' };

      userRepositoryMock.create.mockReturnValue(user);
      userRepositoryMock.save.mockReturnValue(user);

      expect(await service.createUser(createUserDto)).toEqual(user);
    });
  });

  describe('getGamesForUser', () => {
    it('should return games for a user', async () => {
      const games = [
        {
          id: 1,
          playerOne: { username: 'test' },
          status: 'in_progress',
          createdAt: new Date(),
        },
      ];
      const expectedGames = [
        {
          id: 1,
          playerOne: 'test',
          playerTwo: undefined,
          status: 'in_progress',
          createdAt: new Date(),
        },
      ];
      const username = 'test';

      gameRepositoryMock.find.mockReturnValue(games);

      expect(await service.getGamesForUser(username)).toEqual(expectedGames);
    });

    it('should handle empty games array', async () => {
      const username = 'test';

      gameRepositoryMock.find.mockReturnValue([]);

      expect(await service.getGamesForUser(username)).toEqual([]);
    });

    it('should handle null games response', async () => {
      const username = 'test';

      gameRepositoryMock.find.mockReturnValue(null);

      expect(await service.getGamesForUser(username)).toEqual([]);
    });

    it('should handle games with both players', async () => {
      const games = [
        {
          id: 1,
          playerOne: { username: 'player1' },
          playerTwo: { username: 'player2' },
          status: 'completed',
          createdAt: new Date(),
        },
      ];

      const expectedGames = [
        {
          id: 1,
          playerOne: 'player1',
          playerTwo: 'player2',
          status: 'completed',
          createdAt: games[0].createdAt,
        },
      ];

      gameRepositoryMock.find.mockReturnValue(games);

      expect(await service.getGamesForUser('player1')).toEqual(expectedGames);
    });
  });
});
