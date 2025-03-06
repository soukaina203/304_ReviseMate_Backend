import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { QuizSchema } from '../../schemas/quiz.schema';

@Module({
  imports: [SuperModule.forFeature(QuizSchema, 'Quiz')],
  exports: [SuperModule],
})
export class QuizModule {}
