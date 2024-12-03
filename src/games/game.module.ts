import { Module } from '@nestjs/common';
import { GamesController } from './controllers/games.controller';
import { GamesService } from './providers/games.service';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Game, User])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GameModule {}
