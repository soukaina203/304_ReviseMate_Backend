import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { RevisionController } from './summary.controller';

@Module({
  providers: [SummaryService],
  controllers: [RevisionController]
})
export class SummaryModule {}
