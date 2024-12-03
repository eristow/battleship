import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { Game, GameSummary } from 'src/games/entities/game.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      username: createUserDto.username,
    });
    return this.userRepository.save(user);
  }

  async getGamesForUser(username: string): Promise<GameSummary[]> {
    const games = await this.gameRepository.find({
      where: [{ playerOne: { username } }, { playerTwo: { username } }],
      relations: ['playerOne', 'playerTwo'],
    });

    if (!games) {
      return [];
    }

    return games.map((game) => ({
      id: game.id,
      playerOne: game.playerOne.username,
      playerTwo: game.playerTwo?.username,
      status: game.status,
      createdAt: game.createdAt,
    }));
  }
}
