import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { Game, GameSummary } from '../../games/entities/game.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private configService: ConfigService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username: username },
    });
  }

  // TODO: figure out why termination signal is being sent from this method...
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      username: createUserDto.username,
      password: hashedPass,
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
