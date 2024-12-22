import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: '*',
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: process.env.FE_URL,
      credentials: true,
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
