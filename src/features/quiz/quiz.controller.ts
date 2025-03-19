import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Types } from 'mongoose';
import { AuthGuard } from '../../guards/auth.guard';
import { UseGuards } from '@nestjs/common';


@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('save-score/:quizId')
  @UseGuards(AuthGuard)
  async saveScore(
    @Param('quizId') quizId: string,
    @Body('userId') userId: string,
    @Body('correctAnswers') correctAnswers: number,
    @Body('totalQuestions') totalQuestions: number,
  ) {
    return this.quizService.saveScore(quizId, new Types.ObjectId(userId), correctAnswers, totalQuestions);
  }
  @Get('scores/:quizId')
  @UseGuards(AuthGuard)
  async getScores(@Param('quizId') quizId: string) {
    return this.quizService.getScores(quizId);
}
}