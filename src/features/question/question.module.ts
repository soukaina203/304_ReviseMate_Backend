import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { QuestionSchema } from '../../schemas/question.schema';

@Module({
  imports: [SuperModule.forFeature(QuestionSchema, 'Question')],
  exports: [SuperModule],
})
export class QuestionModule {}
