import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { SuperService } from './super.service';
import { SuperController } from './super.controller';
import mongoose, { Model } from 'mongoose';
import { FicheSchema } from '../schemas/fiche.schema';
import { QuizSchema } from '../schemas/quiz.schema';
import { QuestionSchema } from '../schemas/question.schema';
import { UserSchema } from '../schemas/user.schema';
import { ClasseSchema } from '../schemas/classe.schema';
import { CarteMemoireSchema } from '../schemas/carte_memoire.schema';

@Module({})
export class SuperModule {
  static forFeature<T>(model: mongoose.Schema, name: string): DynamicModule {
    return {
      module: SuperModule,
      imports: [
        MongooseModule.forFeature([
          { name: 'Fiche', schema: FicheSchema },
          { name: 'Quiz', schema: QuizSchema },
          { name: 'Question', schema: QuestionSchema },
          { name: 'User', schema: UserSchema },
          { name: 'Classe', schema: ClasseSchema },
          { name: 'Carte_memoire', schema: CarteMemoireSchema },
        ]),
      ],
      providers: [
        {
          provide: SuperService,
          useFactory: (modelInstance: Model<T>) =>
            new SuperService<T>(modelInstance),
          inject: [getModelToken(name)],
        },
      ],
      controllers: [SuperController],
      exports: [SuperService],
    };
  }
}
