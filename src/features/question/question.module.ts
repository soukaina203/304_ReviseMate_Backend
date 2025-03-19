import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Question, QuestionSchema } from '../../schemas/question.schema';
import { QuizModule } from '../quiz/quiz.module'; // Importez le QuizModule
import { AuthGuard } from '../../guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    QuizModule, // Importez le QuizModule ici
  ],
  controllers: [QuestionController],
  providers: [QuestionService, AuthGuard],
  exports: [QuestionService], // Exporter le service pour l'utiliser ailleurs si besoin
})
export class QuestionModule {}
