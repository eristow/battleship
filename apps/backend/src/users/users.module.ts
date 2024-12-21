import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './providers/users.service';
import { Game } from 'src/games/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
