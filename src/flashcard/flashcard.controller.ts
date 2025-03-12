import { Controller, Body, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';

@Controller('flashcard')
export class FlashcardController {constructor(private readonly flashcardService: FlashcardService) {}

@Post('generate')
async generateFlashcards(@Body() { content }: { content: string }) {
  try {
    // Appel au service pour générer la carte mémoire
    const flashcard = await this.flashcardService.generateFlashcards(content);
    return flashcard; // Retourne la question et la réponse générées
  } catch (error) {
    return { error: 'Une erreur est survenue lors de la génération de la carte mémoire.' };
  }
}
}
