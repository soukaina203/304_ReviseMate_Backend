import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user.schema';
import { AdminService } from './admin.service';
import { UserService } from '../features/user/user.service';
import { SuperService } from '../super/super.service';
import { AuthService } from '../auth/auth.service';
import { UserModule } from '../features/user/user.module';
import { CodeProfSchema } from '../schemas/code_prof.schema';
import { SuperModule } from '../super/super.module';
import { Model } from 'mongoose';
import { RoleGuard } from '../guards/role.guard'; 

@Module({
  imports: [
    UserModule,
    SuperModule.forFeature(UserSchema, 'User'),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Code_prof', schema: CodeProfSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AuthService,
    SuperService,
    RoleGuard,
    UserService,
    {
      provide: SuperService,
      useFactory: (modelInstance: Model<any>) =>
        new SuperService(modelInstance),
      inject: [getModelToken('User')],
    },
  ],
})
export class AdminModule {}
