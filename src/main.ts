/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ConsoleLogger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    { logger: new ConsoleLogger() });

  // configuration de la session | session configuration
  app.use(
    session({
      secret: 'S3cr3tK3y!2025',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true },
    }),
  );

  // connexion vers le frontend | connection to the frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Serveur lancé sur http://localhost:${port}`);
}
bootstrap();
