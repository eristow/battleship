import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  checkAll() {
    return this.health.check([
      () => this.http.pingCheck('ships', 'http://localhost:3000/games/ships'),
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('http')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('ships', 'http://localhost:3000/games/ships'),
    ]);
  }

  @Get('db')
  @HealthCheck()
  checkDb() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
