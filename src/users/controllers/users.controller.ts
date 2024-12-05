import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from '../providers/users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { GameSummary } from '../../games/entities/game.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.getUserByUsername(username);
    console.log(user);

    if (!user) {
      throw new BadRequestException('No user exists with that username');
    }

    return user;
  }

  @Get(':username/games')
  async getGamesForUser(
    @Param('username') username: string,
  ): Promise<GameSummary[]> {
    return this.usersService.getGamesForUser(username);
  }

  // TODO: figure out why termination signal is being sent from this method...
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
