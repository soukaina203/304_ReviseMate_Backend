import { Controller, Body, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as pdfParse from 'pdf-parse';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Post() 
  async getSummary(@Body('text') text: string) {
    return { summary: await this.summaryService.summarizeText(text) };
  }

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file')) 
  async getSummaryFromPdf(@UploadedFile() file: any) {  
    // Check if a file was provided
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni.');
    }
    // Check if the file is a PDF
    try {
      const pdfText = await pdfParse(file.buffer);
      const summary = await this.summaryService.summarizeText(pdfText.text);
      return { summary };
    } catch (error) {
      throw new BadRequestException('Erreur lors du traitement du fichier PDF.');
    }
  }
}
