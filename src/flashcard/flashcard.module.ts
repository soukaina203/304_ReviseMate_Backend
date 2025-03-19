import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [HttpModule], 
  providers: [FlashcardService, AuthGuard],
  controllers: [FlashcardController]
})
export class FlashcardModule {}
