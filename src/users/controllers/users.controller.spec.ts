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
  let service: UsersService;
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

    service = module.get<UsersService>(UsersService);
    userRepositoryMock = module.get(getRepositoryToken(User));
    gameRepositoryMock = module.get(getRepositoryToken(Game));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepositoryMock).toBeDefined();
    expect(gameRepositoryMock).toBeDefined();
  });

  it('should return all users', async () => {
    const users = [{ username: 'test' }];

    userRepositoryMock.find.mockReturnValue(users);

    expect(await service.getAllUsers()).toEqual(users);
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

    expect(await service.getGamesForUser(username)).toEqual(expectedGames);
  });

  it('should create a user', async () => {
    const createUserDto = { username: 'test' };
    const user = { username: 'test' };

    userRepositoryMock.create.mockReturnValue(user);
    userRepositoryMock.save.mockReturnValue(user);

    expect(await service.createUser(createUserDto)).toEqual(user);
  });
});
