import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // Enable CORS
   app.enableCors({
    origin: 'http://localhost:4200', // Allow requests from your Angular app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and credentials
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

;
