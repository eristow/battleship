import { GamesService } from 'src/games/providers/games.service';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const gamesServiceFactory: () => MockType<GamesService<any>> = jest.fn(
  () => ({
    getAllGames: jest.fn(),
    getValidShips: jest.fn(),
    getGameById: jest.fn(),
    deleteGame: jest.fn(),
    createGame: jest.fn(),
    joinGame: jest.fn(),
    placeShips: jest.fn(),
    makeMove: jest.fn(),
  }),
);
