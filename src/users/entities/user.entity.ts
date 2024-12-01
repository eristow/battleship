import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  // TODO: implement this class
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  username: string;
}
