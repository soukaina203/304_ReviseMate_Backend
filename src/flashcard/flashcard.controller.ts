import { Controller, Body, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as pdfParse from 'pdf-parse';
import { FlashcardService } from './flashcard.service';


@Controller('flashcard')
export class FlashcardController {constructor(private readonly flashcardService: FlashcardService) {}

@Post('')
async generateFlashcards(@Body() { content }: { content: string }) {
  try {
    // Appel au service pour générer la carte mémoire
    const flashcard = await this.flashcardService.generateFlashcards(content);
    return flashcard; // Retourne la question et la réponse générées
  } catch (error) {
    return { error: 'Une erreur est survenue lors de la génération de la carte mémoire.' };
  }
}
// Ajouter une route pour générer des cartes mémoire à partir d'un fichier PDF
@Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  async generateFlashcardsFromPdf(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('Aucun fichier fourni.');
      }

      // Extraire le texte du PDF
      const pdfText = await pdfParse(file.buffer);

      // Appeler le service pour générer les flashcards
      const flashcards = await this.flashcardService.generateFlashcards(pdfText.text);
      return flashcards;
    } catch (error) {
      return { error: 'Une erreur est survenue lors de la génération des cartes mémoire à partir du PDF.' };
    }
  }
}
