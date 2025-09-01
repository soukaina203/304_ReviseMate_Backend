import { Controller, Get, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AuthGuard } from '../../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('quiz/:quizId')
  async findQuestionsByQuiz(@Param('quizId') quizId: string) {
    return this.questionService.findQuestionsByQuiz(quizId);
  }
}
