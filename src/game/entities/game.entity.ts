import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board, BoardConfig } from '../classes/board.class';
import { User } from '../../users/entities/user.entity';
import { Ship } from '../classes/ship.class';

export enum GameStatus {
  SETUP = 'SETUP',
  WAITING_FOR_PLAYER_TWO = 'WAITING_FOR_PLAYER_TWO',
  PLAYER_ONE_TURN = 'PLAYER_ONE_TURN',
  PLAYER_TWO_TURN = 'PLAYER_TWO_TURN',
  PLAYER_ONE_WIN = 'PLAYER_ONE_WIN',
  PLAYER_TWO_WIN = 'PLAYER_TWO_WIN',
}

const boardTransformer = {
  to: (value: Board) => value?.toJSON() ?? null,
  from: (value: BoardConfig) => {
    if (!value) return null;

    const board = new Board(value.size);

    value.ships.forEach((shipData) => {
      const ship = new Ship(
        shipData.name,
        shipData.length,
        shipData.startX,
        shipData.startY,
        shipData.isHorizontal,
        shipData.currentHits,
      );
      board.placeShip(ship);
    });

    return board;
  },
};

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  playerOne: User;

  @ManyToOne(() => User, { nullable: true })
  playerTwo: User;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.SETUP,
  })
  status: GameStatus;

  @Column({ type: 'json', transformer: boardTransformer })
  playerOneBoard: Board;

  @Column({ type: 'json', transformer: boardTransformer, nullable: true })
  playerTwoBoard: Board;

  @CreateDateColumn()
  createdAt: Date;
}
