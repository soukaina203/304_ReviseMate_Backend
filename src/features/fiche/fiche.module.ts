// CRUD des fiche
import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { FicheSchema } from '../../schemas/fiche.schema';

@Module({
  imports: [SuperModule.forFeature(FicheSchema, 'Fiche')],
  exports: [SuperModule],
})
export class FicheModule {}
