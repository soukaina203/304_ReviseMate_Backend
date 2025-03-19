import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { RevisionController } from './summary.controller';
import { AuthGuard } from '../guards/auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [SummaryService, AuthGuard],
  controllers: [RevisionController]
})
export class SummaryModule {}
