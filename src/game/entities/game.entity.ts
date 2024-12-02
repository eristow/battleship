import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board, BoardConfig } from '../classes/board.class';
import { User } from '../../users/entities/user.entity';

export enum GameStatus {
  SETUP = 'SETUP',
  WAITING_FOR_PLAYER_TWO = 'WAITING_FOR_PLAYER_TWO',
  PLAYER_ONE_TURN = 'PLAYER_ONE_TURN',
  PLAYER_TWO_TURN = 'PLAYER_TWO_TURN',
  PLAYER_ONE_WIN = 'PLAYER_ONE_WIN',
  PLAYER_TWO_WIN = 'PLAYER_TWO_WIN',
}

const boardTransformer = {
  to: (value: Board) => value.toJSON(),
  from: (value: BoardConfig) => {
    const board = new Board(value.size);
    board.setGrid(value.grid);
    board.setShips(value.ships);
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

  // @Column('json')
  // playerOneShips: ShipConfig[];

  // @Column('json', { nullable: true })
  // playerTwoShips: ShipConfig[];

  @CreateDateColumn()
  createdAt: Date;
}
