import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors for local development only
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
