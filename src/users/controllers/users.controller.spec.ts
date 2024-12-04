import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../providers/users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { MockType } from '../../testing/mock-type';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../testing/repository-mock-factory';
import { Game } from '../../games/entities/game.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let userRepositoryMock: MockType<Repository<User>>;
  let gameRepositoryMock: MockType<Repository<Game>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
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

    controller = module.get<UsersController>(UsersController);
    userRepositoryMock = module.get(getRepositoryToken(User));
    gameRepositoryMock = module.get(getRepositoryToken(Game));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userRepositoryMock).toBeDefined();
    expect(gameRepositoryMock).toBeDefined();
  });

  it('should return all users', async () => {
    const users = [{ username: 'test' }];

    userRepositoryMock.find.mockReturnValue(users);

    expect(await controller.getAllUsers()).toEqual(users);
  });

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

    expect(await controller.getGamesForUser(username)).toEqual(expectedGames);
  });

  it('should create a user', async () => {
    const createUserDto = { username: 'test' };
    const user = { username: 'test' };

    userRepositoryMock.create.mockReturnValue(user);
    userRepositoryMock.save.mockReturnValue(user);

    expect(await controller.createUser(createUserDto)).toEqual(user);
  });

  it('should handle empty users array', async () => {
    userRepositoryMock.find.mockReturnValue([]);
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
    expect(await controller.getGamesForUser('player1')).toEqual(expectedGames);
  });

  it('should handle non-existent username', async () => {
    gameRepositoryMock.find.mockReturnValue([]);
    expect(await controller.getGamesForUser('nonexistent')).toEqual([]);
  });
});