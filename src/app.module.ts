import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { User } from './users/entities/user.entity';
import { Game } from './game/entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // TODO: extract this into a config service
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'testuser',
      password: 'password',
      database: 'test',
      entities: [User, Game],
      synchronize: true,
    }),
    GameModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
