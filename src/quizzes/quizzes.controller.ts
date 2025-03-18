import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuizzesService } from './quizzes.service';
import * as pdfParse from 'pdf-parse';
import { AuthGuard } from '../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('')
  @UseGuards(AuthGuard)
  async generateQuizzes(@Body() { content }: { content: string }) {
    try {
      const quizzes = await this.quizzesService.generateQuizzes(content);
      return quizzes; // Retourne le quiz généré
    } catch {
      return {
        error: 'Une erreur est survenue lors de la génération du quiz.',
      };
    }
  }

  @Post('pdf')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async generateQuizzesFromPdf(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('Aucun fichier pdf fourni.');
      }

      const pdfText = await pdfParse(file.buffer);
      const quizzes = await this.quizzesService.generateQuizzes(pdfText.text);

      return quizzes;
    } catch {
      return {
        error:
          'Une erreur est survenue lors de la génération des quiz à partir du PDF.',
      };
    }
  }
}
