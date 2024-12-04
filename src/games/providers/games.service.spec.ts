import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from '../../testing/mock-type';
import { repositoryMockFactory } from '../../testing/repository-mock-factory';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { GamesController } from '../controllers/games.controller';
import { Game } from '../entities/game.entity';
import { GamesService } from './games.service';
import { ConfigModule } from '@nestjs/config';

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
});
