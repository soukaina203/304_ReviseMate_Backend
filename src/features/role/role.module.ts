import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { RoleSchema } from '../../schemas/role.schema';
@Module({
  imports: [SuperModule.forFeature(RoleSchema, 'Role')],
  exports: [SuperModule],
})
export class RoleModule {}
