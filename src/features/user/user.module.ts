import { Module } from '@nestjs/common';
import { SuperModule } from '../../super/super.module';
import { UserSchema } from '../../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSchema } from '../../schemas/quiz.schema';
import { FicheSchema } from '../../schemas/fiche.schema';
import { CarteMemoireSchema } from '../../schemas/carte_memoire.schema';  // Import du schema CarteMemoire (si nécessaire)

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Fiche', schema: FicheSchema },
      { name: 'CarteMemoire', schema: CarteMemoireSchema },  // Ajoutez ici le modèle CarteMemoire
    ]),
    SuperModule,
  ],
  exports: [SuperModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
