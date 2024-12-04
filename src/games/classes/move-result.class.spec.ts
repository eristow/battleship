import { AttackOutcome, MoveResult, ShipInfo } from './move-result.class';

describe('MoveResult', () => {
  describe('getDescription', () => {
    it('should return the correct string for a miss', () => {
      const moveResult = new MoveResult(AttackOutcome.MISS, 'player1', 1, 1);

      expect(moveResult.getDescription()).toBe('Missed at coordinates (1, 1)');
    });

    it('should return the correct string for a hit', () => {
      const shipInfo = { name: 'ship1', length: 3, isSunk: false } as ShipInfo;
      const moveResult = new MoveResult(
        AttackOutcome.HIT,
        'player1',
        1,
        1,
        shipInfo,
      );

      expect(moveResult.getDescription()).toBe(
        'Hit ship1 at coordinates (1, 1)',
      );
    });

    it('should return the correct string for a sink', () => {
      const shipInfo = { name: 'ship1', length: 3, isSunk: false } as ShipInfo;
      const moveResult = new MoveResult(
        AttackOutcome.SUNK,
        'player1',
        1,
        1,
        shipInfo,
      );

      expect(moveResult.getDescription()).toBe(
        'Sunk ship1 at coordinates (1, 1)',
      );
    });

    it('should not error when hitShip is undefined', () => {
      const moveResult = new MoveResult(AttackOutcome.HIT, 'player1', 1, 1);

      expect(moveResult.getDescription()).toBe(
        'Hit undefined at coordinates (1, 1)',
      );
    });
  });
});
