import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  board: Board;

  @CreateDateColumn()
  createdAt: Date;
}

export enum GameStatus {
  SETUP = 'SETUP',
  IN_PROGRESS = 'IN_PROGRESS',
  PLAYER_ONE_WIN = 'PLAYER_ONE_WIN',
  PLAYER_TWO_WIN = 'PLAYER_TWO_WIN',
}
