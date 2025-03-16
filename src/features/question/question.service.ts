import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../../schemas/question.schema';
import { Quiz } from '../../schemas/quiz.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
  ) {}

  async findQuestionsByQuiz(quizId: string) {
    const questions = await this.questionModel.find({ id_quiz: quizId }).exec();
    const quiz = await this.quizModel.findById(quizId).exec();
    return {
      quizTitle: quiz ? quiz.titre : 'Titre Inconnu', // Utilisez 'titre' au lieu de 'title'
      questions: questions,
    };
  }
}
