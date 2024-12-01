import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../models/board.model';
import { ShipConfig } from '../dto/create-game.dto';
import { User } from '../../users/entities/user.entity';

export enum GameStatus {
  SETUP = 'SETUP',
  WAITING_FOR_PLAYER_TWO = 'WAITING_FOR_PLAYER_TWO',
  IN_PROGRESS = 'IN_PROGRESS',
  PLAYER_ONE_WIN = 'PLAYER_ONE_WIN',
  PLAYER_TWO_WIN = 'PLAYER_TWO_WIN',
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  playerOne: User;

  @ManyToOne(() => User)
  playerTwo: User;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.SETUP,
  })
  status: GameStatus;

  @Column('json')
  playerOneBoard: Board;

  @Column('json')
  playerTwoBoard: Board;

  @Column('json')
  playerOneShips: ShipConfig[];

  @Column('json')
  playerTwoShips: ShipConfig[];

  @CreateDateColumn()
  createdAt: Date;
}
