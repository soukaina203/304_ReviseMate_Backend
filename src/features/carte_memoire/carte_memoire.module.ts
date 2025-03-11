import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { CarteMemoireSchema } from '../../schemas/carte_memoire.schema';

@Module({
  imports: [SuperModule.forFeature(CarteMemoireSchema, 'Carte_memoire')],
  exports: [SuperModule],
})
export class Carte_memoireModule {}
