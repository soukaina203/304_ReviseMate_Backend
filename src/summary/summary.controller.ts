import {
  Controller,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as pdfParse from 'pdf-parse';
import { SummaryService } from './summary.service';
import { AuthGuard } from '../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('revision')
export class RevisionController {
  constructor(private readonly summaryService: SummaryService) {}

  // Ajouter une route pour générer une fiche de révision à partir d'un texte
  @Post()
  async getRevisionSheet(@Body('text') text: string, @Body('customPrompt') customPrompt?: string) {
    return { revisionSheet: await this.summaryService.createRevisionSheet(text, customPrompt) };
  }

  // Ajouter une route pour générer une fiche de révision à partir d'un fichier PDF
  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  async getRevisionSheetFromPdf(@UploadedFile() file: any, @Body('customPrompt') customPrompt?: string) {
    // Vérifier si un fichier a été fourni
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni.');
    }

    // Extraire le texte du PDF
    try {
      const pdfText = await pdfParse(file.buffer);
      const revisionSheet = await this.summaryService.createRevisionSheet(
        pdfText.text,
        customPrompt,
      );
      return { revisionSheet };
    } catch (error) {
      throw new BadRequestException(
        'Erreur lors du traitement du fichier PDF.',
      );
    }
  }
}
