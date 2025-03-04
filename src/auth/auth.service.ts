/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { Code_prof } from 'src/schemas/code_prof.schema';

@Injectable()
export class AuthService {
  // Add the User model to the constructor. | Ajouter le modèle User au constructeur.
  constructor(@InjectModel(User.name) private userModel: Model<User> ,    @InjectModel(Code_prof.name) private universityModel: Model<Code_prof>,
) {}



  // Fetch the first university document
  async getProfCode(): Promise<Code_prof | null> {
    return this.universityModel.findOne().sort({ _id: 1 }).exec(); // Fetch the first document
  }



  // Add the register() method to the AuthService class. | Ajouter la méthode register() à la classe AuthService.
  async register(registerDto: RegisterDto): Promise<User> {
    // Extract the firstName, lastName, email, and password from the registerDto object. | Extraire le firstName, lastName, email et password de l'objet registerDto.
    const { firstName, lastName, email, password } = registerDto;

    // Check if a user with the same email already exists. | Vérifier si un utilisateur avec le même email existe déjà.
    const existingUser = await this.userModel.findOne({ email }).exec();

    // If a user with the same email already exists, throw a BadRequestException. | Si un utilisateur avec le même email existe déjà, lancer une BadRequestException.
    if (existingUser) {
      throw new BadRequestException(
        'Un compte existe déjà avec cette adresse mail.',
      );
    }

    // Hash the password using the bcrypt library. | Hacher le mot de passe en utilisant la bibliothèque bcrypt.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user using the User model and the extracted values. | // Créer un nouvel utilisateur en utilisant le modèle User et les valeurs
    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return newUser.save();
  }

  async login(email: string, password: string) {
    // Recherche l'utilisateur dans la base de données par email
    const user = await this.userModel.findOne({ email }).exec();

    // Vérifie si l'utilisateur existe
    if (!user) {
      return null; // Utilisateur non trouvé
    }

    // Vérifie si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null; // Mot de passe incorrect
    }

    return user; // Utilisateur trouvé et mot de passe valide
  }
}
