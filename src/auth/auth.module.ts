import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Code_prof, CodeProfSchema } from '../schemas/code_prof.schema';
import { AuthGuard } from '../guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // Add the MongooseModule.forFeature() method to the imports array to import the User model. | Pour importer le modèle User, on ajoute la méthode MongooseModule.forFeature() au tableau des imports.
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Code_prof.name, schema: CodeProfSchema },
    ]),
  ],
  controllers: [AuthController], // Add the AuthController to the controllers array.| Ajouter AuthController au tableau des contrôleurs.
  providers: [AuthService, AuthGuard], // Add the AuthService to the providers array.| Ajouter AuthService au tableau des fournisseurs.
  exports: [AuthService], // Export the AuthService class.| Exporter la classe AuthService.
})
export class AuthModule {}
