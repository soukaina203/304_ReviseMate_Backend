import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz } from '../../schemas/quiz.schema';


@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
  ) {}

  async saveScore(quizId: string, userId: Types.ObjectId, correctAnswers: number, totalQuestions: number): Promise<Quiz> {
    return this.quizModel.findByIdAndUpdate(
      quizId,
      { $push: { scores: { userId, correctAnswers, totalQuestions, date: new Date() } } },
      { new: true }
    ).exec();
  }
  async getScores(quizId: string): Promise<any> {
    const quiz = await this.quizModel.findById(quizId).exec();
    return quiz ? quiz.scores : [];
  }
}
