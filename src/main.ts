import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // connexion vers le frontend | connection to the frontend
  app.enableCors({
    origin: 'http://localhost:4200/',
    credentials: true,
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Serveur lancé sur http://localhost:${port}`);
}
bootstrap();
