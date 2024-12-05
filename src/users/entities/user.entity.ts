import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('varchar')
  username: string;

  @Column('varchar')
  password: string;
}
