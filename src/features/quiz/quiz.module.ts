import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { QuizSchema } from '../../schemas/quiz.schema';
import { QuizService } from './quiz.service'; 
import { QuizController } from './quiz.controller'; 

@Module({
  imports: [SuperModule.forFeature(QuizSchema, 'Quiz')],
  providers: [QuizService], 
  controllers: [QuizController],
  exports: [SuperModule], 
})
export class QuizModule {}
