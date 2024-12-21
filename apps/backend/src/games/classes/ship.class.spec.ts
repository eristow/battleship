import { ShipType } from '../dto/ship-config.dto';
import { Ship } from './ship.class';

describe('Ship', () => {
  it('should throw an error when length is less than 1', () => {
    expect(() => new Ship(ShipType.BATTLESHIP, 0, 0, 0, true)).toThrow(
      'Ship length must be at least 1',
    );
  });

  describe('calculateCoordinates', () => {
    it('should calculate coordinates for a horizontal ship', () => {
      const ship = new Ship(ShipType.BATTLESHIP, 4, 0, 0, true);

      expect(ship.coordinates).toEqual(['0,0', '1,0', '2,0', '3,0']);
    });

    it('should calculate coordinates for a vertical ship', () => {
      const ship = new Ship(ShipType.BATTLESHIP, 4, 0, 0, false);

      expect(ship.coordinates).toEqual(['0,0', '0,1', '0,2', '0,3']);
    });
  });

  describe('hit', () => {
    it('should increment current hits when hit', () => {
      const ship = new Ship(ShipType.BATTLESHIP, 4, 0, 0, true);

      ship.hit();

      expect(ship.currentHits).toBe(1);
    });
  });

  describe('isSunk', () => {
    it('should return true when ship is sunk', () => {
      const ship = new Ship(ShipType.BATTLESHIP, 1, 0, 0, true);

      ship.hit();

      expect(ship.isSunk()).toBe(true);
    });
  });
});
