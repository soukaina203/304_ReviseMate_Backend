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

// Assurez-vous d'importer votre schéma CarteMemoire ici
import { CarteMemoireSchema } from '../schemas/carte_memoire.schema';  // Assurez-vous que ce fichier existe et contient le schéma

@Module({
  imports: [
    UserModule,
    SuperModule.forFeature(UserSchema, 'User'),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Code_prof', schema: CodeProfSchema },
      // Ajoutez ici le modèle CarteMemoire
      { name: 'CarteMemoire', schema: CarteMemoireSchema },  // Ajoutez cette ligne
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
