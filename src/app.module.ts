import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { User } from './users/entities/user.entity';
import { Game } from './game/entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.development.local' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Game],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GameModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
