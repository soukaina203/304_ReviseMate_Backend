import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';

@Module({
  imports: [HttpModule], 
  providers: [FlashcardService],
  controllers: [FlashcardController]
})
export class FlashcardModule {}
