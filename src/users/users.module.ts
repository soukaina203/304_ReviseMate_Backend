import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../schemas/user.schema';

// Add the MongooseModule.forFeature() method to the imports array to import the User model. | Pour importer le modèle User, on ajoute la méthode MongooseModule.forFeature() au tableau des imports.
@Module({
  // Add the MongooseModule.forFeature() method to the imports array to import the User model. | Pour importer le modèle User, on ajoute la méthode MongooseModule.forFeature() au tableau des imports.
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService], // Add the UsersService to the providers array. | Ajouter UsersService au tableau des fournisseurs.
  controllers: [UsersController], // Add the UsersController to the controllers array. | Ajouter UsersController au tableau des contrôleurs.
  exports: [UsersService], // Export the UsersService class. | Exporter la classe UsersService.
})
export class UsersModule {}
