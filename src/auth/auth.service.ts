import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  // Add the User model to the constructor.
  // Ajouter le modèle User au constructeur.
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Add the register() method to the AuthService class.
  // Ajouter la méthode register() à la classe AuthService.
  async register(registerDto: RegisterDto): Promise<User> {

    // Extract the firstName, lastName, email, and password from the registerDto object.
    // Extraire le firstName, lastName, email et password de l'objet registerDto.
    const { firstName, lastName, email, password } = registerDto;

    // Check if a user with the same email already exists.
    // Vérifier si un utilisateur avec le même email existe déjà.
    const existingUser = await this.userModel.findOne({ email }).exec();

    // If a user with the same email already exists, throw a BadRequestException.
    // Si un utilisateur avec le même email existe déjà, lancer une BadRequestException.
    if (existingUser) {
      throw new BadRequestException(
        'Un compte existe déjà avec cette adresse mail.',
      );
    }

    // Hash the password using the bcrypt library.
    // Hacher le mot de passe en utilisant la bibliothèque bcrypt.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user using the User model and the extracted values.
    // Créer un nouvel utilisateur en utilisant le modèle User et les valeurs
    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return newUser.save();
  }
}
