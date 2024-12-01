import { Module } from '@nestjs/common';
import { GameController } from './controllers/game.controller';
import { GameService } from './providers/game.service';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}