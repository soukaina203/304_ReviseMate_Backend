/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { Code_prof, CodeProfDocument } from "src/schemas/code_prof.schema";

@Injectable()
export class AuthService {
  // Add the User model to the constructor. | Ajouter le modèle User au constructeur.
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Code_prof.name) private universityModel: Model<CodeProfDocument>,
) {}



  // Fetch the first university document
  async getProfCode(): Promise<Code_prof | null> {
    return this.universityModel.findOne().sort({ _id: 1 }).exec(); // Fetch the first document
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }
  

  // Add the register() method to the AuthService class. | Ajouter la méthode register() à la classe AuthService.
  async register(registerDto: RegisterDto): Promise<User | null> {
    const { firstName, lastName, email, password } = registerDto;

    // Vérifier si l'utilisateur existe déjà dans la base de données 
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      return null; // Utilisateur déjà existant
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer un nouvel utilisateur
    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Sauvegarder l'utilisateur dans la base de données
    return newUser.save(); // Retourne l'utilisateur créé
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
