import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.getUserByUsername(username);
    const passwordMatch = await bcrypt.compare(user?.password, pass);

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.username, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
