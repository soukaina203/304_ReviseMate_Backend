import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { UserSchema } from '../../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    SuperModule,
  ],
  exports: [SuperModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
