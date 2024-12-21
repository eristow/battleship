import { ShipType } from '../dto/ship-config.dto';
import { Board, CellState } from './board.class';
import { ShipInfo } from './move-result.class';
import { Ship } from './ship.class';

describe('Board', () => {
  describe('initializeGrid', () => {
    it('should initialize a grid of the correct size', () => {
      const board = new Board(10);

      expect(board.size).toBe(10);
      expect(board.toJSON().grid.length).toBe(10);
      expect(board.toJSON().grid[0].length).toBe(10);
    });
  });

  describe('placeShip', () => {
    it('should place a ship on the board', () => {
      const board = new Board(10);
      const ship: Ship = new Ship(ShipType.BATTLESHIP, 4, 0, 0, true);

      board.placeShip(ship);

      expect(board.toJSON().ships.length).toBe(1);
      expect(board.toJSON().ships[0].coordinates.length).toBe(4);
    });

    it('should not place a ship out of bounds', () => {
      const board = new Board(10);
      const ship = new Ship(ShipType.BATTLESHIP, 4, 9, 9, true);

      const result = board.placeShip(ship);

      expect(board.toJSON().ships.length).toBe(0);
      expect(result.error).toBe('Battleship out of bounds');
    });

    it('should not place a ship on overlapping another ship', () => {
      const board = new Board(10);
      const ship1 = new Ship(ShipType.CARRIER, 5, 1, 1, true);
      const ship2 = new Ship(ShipType.BATTLESHIP, 4, 1, 1, true);

      board.placeShip(ship1);
      const result = board.placeShip(ship2);

      expect(board.toJSON().ships.length).toBe(1);
      expect(result.error).toBe(
        'Carrier already exists at coordinates: 1,1; 2,1; 3,1; 4,1',
      );
    });
  });

  describe('checkGameOver', () => {
    it('should return game over when all ships are sunk', () => {
      const board = new Board(10);
      const ship = new Ship(ShipType.BATTLESHIP, 4, 0, 0, true);

      board.placeShip(ship);
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 0);
      board.receiveAttack(2, 0);
      board.receiveAttack(3, 0);

      expect(board.checkGameOver()).toBe(true);
    });
  });

  describe('updateGrid', () => {
    it('should replace the grid with a new grid', () => {
      const board = new Board(10);
      const grid = Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => CellState.SUNK),
      );

      board.updateGrid(grid);

      expect(board.toJSON().grid).toEqual(grid);
    });
  });

  describe('toJSON', () => {
    it('should return the board as JSON', () => {
      const board = new Board(10);

      const json = board.toJSON();

      expect(json.size).toBe(10);
    });
  });

  describe('receiveAttack', () => {
    it('should return if the hit is a repeat', () => {
      const board = new Board(10);
      const ship = new Ship(ShipType.BATTLESHIP, 4, 0, 0, true);

      board.placeShip(ship);
      board.receiveAttack(0, 0);
      const attackResult = board.receiveAttack(0, 0);

      expect(attackResult.cellState).toBe(CellState.MISS);
      expect(attackResult.isRepeatHit).toBe(true);
      expect(attackResult.sunkShip).toBeUndefined();
    });

    it('should return if the hit is a miss', () => {
      const board = new Board(10);
      const ship = new Ship(ShipType.BATTLESHIP, 4, 0, 0, true);

      board.placeShip(ship);
      const attackResult = board.receiveAttack(9, 9);

      expect(attackResult.cellState).toBe(CellState.MISS);
      expect(attackResult.isRepeatHit).toBe(false);
      expect(attackResult.sunkShip).toBeUndefined();
    });

    it('should return if the hit is a hit', () => {
      const board = new Board(10);
      const ship = new Ship(ShipType.BATTLESHIP, 4, 0, 0, true);

      board.placeShip(ship);
      const attackResult = board.receiveAttack(0, 0);

      expect(attackResult.cellState).toBe(CellState.HIT);
      expect(attackResult.isRepeatHit).toBe(false);
      expect(attackResult.sunkShip).toBeUndefined();
    });

    it('should return if the hit is a sink', () => {
      const board = new Board(10);
      const ship = new Ship(ShipType.BATTLESHIP, 1, 0, 0, true);
      const shipInfo: ShipInfo = {
        name: ship.name,
        length: ship.length,
        isSunk: true,
      };

      board.placeShip(ship);
      const attackResult = board.receiveAttack(0, 0);

      expect(attackResult.cellState).toBe(CellState.SUNK);
      expect(attackResult.isRepeatHit).toBe(false);
      expect(attackResult.sunkShip).toStrictEqual(shipInfo);
    });
  });
});
