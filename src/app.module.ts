import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperModule } from './super/super.module';
import { FicheModule } from './features/fiche/fiche.module';
import { QuizModule } from './features/quiz/quiz.module';
import { QuestionModule } from './features/question/question.module';
import { UserModule } from './features/user/user.module';
import { ClasseModule } from './features/classe/classe.module';
import { Carte_memoireModule } from './features/carte_memoire/carte_memoire.module';

@Module({
  imports: [
    AuthModule,
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
    FicheModule,
    QuizModule,
    QuestionModule, // CRUD
    UserModule,
    ClasseModule,
    Carte_memoireModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
