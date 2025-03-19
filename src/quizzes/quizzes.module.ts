import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [HttpModule],
  providers: [QuizzesService, AuthGuard],
  controllers: [QuizzesController],
})
export class QuizzesModule {}
