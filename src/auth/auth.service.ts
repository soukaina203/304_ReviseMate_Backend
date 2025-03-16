/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from "../schemas/user.schema";
import { RegisterDto } from './dto/register.dto';
import { Code_prof, CodeProfDocument } from "src/schemas/code_prof.schema";

@Injectable()
export class AuthService {
  // Add the User model to the constructor. | Ajouter le modèle User au constructeur.
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Code_prof.name) private universityModel: Model<CodeProfDocument>,
) {}

  // Add the isCodeValid() method to the AuthService class. | Ajouter la méthode isCodeValid() à la classe
  async isCodeValid(code: number): Promise<boolean> {
    const firstUniversity = await this.universityModel.findOne().exec();
    
    if (!firstUniversity) {
      return false; // Aucun code trouvé dans la base de données
    }

    // Conversion des deux codes en number
    const dbCode = Number(firstUniversity.code);  // Conversion en number
    const userCode = Number(code); // Conversion en number

    // Comparaison des deux codes
    return dbCode === userCode;
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


  async login(email: string, password: string): Promise<UserDocument | null> {
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
