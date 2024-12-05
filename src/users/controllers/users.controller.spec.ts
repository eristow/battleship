import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../providers/users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { MockType } from '../../testing/mock-type';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../testing/repository-mock-factory';
import { Game } from '../../games/entities/game.entity';
import { usersServiceFactory } from '../../testing/users-service-mock-factory';

describe('UsersController', () => {
  let controller: UsersController;
  let userRepositoryMock: MockType<Repository<User>>;
  let gameRepositoryMock: MockType<Repository<Game>>;
  let usersServiceMock: MockType<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: usersServiceFactory,
        },
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

    controller = module.get<UsersController>(UsersController);
    userRepositoryMock = module.get(getRepositoryToken(User));
    gameRepositoryMock = module.get(getRepositoryToken(Game));
    usersServiceMock = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userRepositoryMock).toBeDefined();
    expect(gameRepositoryMock).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [{ username: 'test' }];

      userRepositoryMock.find.mockReturnValue(users);
      usersServiceMock.getAllUsers.mockReturnValue(users);

      expect(await controller.getAllUsers()).toEqual(users);
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user with given username', async () => {
      const username = 'test';
      const user = { username: username };

      usersServiceMock.getUserByUsername.mockReturnValue(user);

      expect(await controller.getUserByUsername(username)).toEqual(user);
    });

    it('should throw when no user exists with username', () => {
      usersServiceMock.getUserByUsername.mockReturnValue(null);

      expect(() => controller.getUserByUsername('test')).rejects.toThrow();
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = { username: 'test', password: 'password' };
      const user = { username: 'test', password: 'password' };

      userRepositoryMock.create.mockReturnValue(user);
      userRepositoryMock.save.mockReturnValue(user);
      usersServiceMock.createUser.mockReturnValue(user);

      expect(await controller.createUser(createUserDto)).toEqual(user);
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
      usersServiceMock.getGamesForUser.mockReturnValue(expectedGames);

      expect(await controller.getGamesForUser(username)).toEqual(expectedGames);
    });

    it('should handle empty users array', async () => {
      userRepositoryMock.find.mockReturnValue([]);
      usersServiceMock.getAllUsers.mockReturnValue([]);

      expect(await controller.getAllUsers()).toEqual([]);
    });

    it('should handle games with multiple players', async () => {
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
      usersServiceMock.getGamesForUser.mockReturnValue(expectedGames);

      expect(await controller.getGamesForUser('player1')).toEqual(
        expectedGames,
      );
    });

    it('should handle non-existent username', async () => {
      gameRepositoryMock.find.mockReturnValue([]);
      usersServiceMock.getGamesForUser.mockReturnValue([]);

      expect(await controller.getGamesForUser('nonexistent')).toEqual([]);
    });
  });
});
