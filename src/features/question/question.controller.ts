import { Controller, Get, Param } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('quiz/:quizId')
  async findQuestionsByQuiz(@Param('quizId') quizId: string) {
    return this.questionService.findQuestionsByQuiz(quizId);
  }
}
