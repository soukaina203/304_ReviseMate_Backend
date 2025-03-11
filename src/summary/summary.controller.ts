import { Controller, Post, Body } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  // The getSummary method receives the text to summarize in the request body
  // and returns the summarized text in the response
  @Post() 
  async getSummary(@Body('text') text: string) {
    return { summary: await this.summaryService.summarizeText(text) };
  }
}
