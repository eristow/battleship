import { boardTransformer } from './game.entity';
import { Board, CellState } from '../classes/board.class';

describe('GameEntity', () => {
  describe('boardTransformer', () => {
    it('should transform the entity to a DTO', () => {
      const entity = new Board(10);

      const dto = boardTransformer.to(entity);

      expect(dto).toEqual({
        size: 10,
        grid: Array(10).fill(Array(10).fill(CellState.EMPTY)),
        ships: [],
      });
    });

    it('should transform the DTO to an entity', () => {
      const dto = {
        size: 10,
        grid: Array(10).fill(Array(10).fill(CellState.EMPTY)),
        ships: [],
      };

      const entity = boardTransformer.from(dto);

      expect(entity).toBeInstanceOf(Board);
      expect(entity.size).toBe(10);
    });
  });
});
