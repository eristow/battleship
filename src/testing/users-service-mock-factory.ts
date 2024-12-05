import { GameSummary } from 'src/games/entities/game.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/providers/users.service';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const usersServiceFactory: () => MockType<UsersService<any>> = jest.fn(
  () => ({
    getAllUsers: jest.fn(() => Promise<User[]>),
    createUser: jest.fn(() => Promise<User>),
    getGamesForUser: jest.fn(() => Promise<GameSummary[]>),
    getUserByUsername: jest.fn(() => Promise<User>),
  }),
);
