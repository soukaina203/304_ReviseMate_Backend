import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [SuperModule.forFeature(UserSchema, 'User')],
  exports: [SuperModule],
})
export class UserModule {}
