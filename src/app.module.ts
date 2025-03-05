import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperModule } from './super/super.module';
import { FicheModule } from './features/fiche/fiche.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    SuperModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');
        return {
          uri: mongoUri, // La connexion avec la bonne base de données
        };
      },
    }),
    /* Les CRUD */
    FicheModule, // CRUD
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
