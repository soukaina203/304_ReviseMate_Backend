import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  // Add the MongooseModule.forFeature() method to the imports array to import the User model.
  // Pour importer le modèle User, on ajoute la méthode MongooseModule.forFeature() au tableau des imports.
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController], // Add the AuthController to the controllers array.| Ajouter AuthController au tableau des contrôleurs.
  providers: [AuthService], // Add the AuthService to the providers array.| Ajouter AuthService au tableau des fournisseurs.
  exports: [AuthService], // Export the AuthService class.| Exporter la classe AuthService.
})
export class AuthModule {}
