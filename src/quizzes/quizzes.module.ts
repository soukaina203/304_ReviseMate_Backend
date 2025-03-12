import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';

@Module({
  imports: [HttpModule],
  providers: [QuizzesService],
  controllers: [QuizzesController],
})
export class QuizzesModule {}
