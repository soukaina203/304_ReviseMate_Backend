import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { ClasseSchema } from '../../schemas/classe.schema';

@Module({
  imports: [SuperModule.forFeature(ClasseSchema, 'Classe')],
  exports: [SuperModule],
})
export class ClasseModule {}
