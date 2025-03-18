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
    const { firstName, lastName, email, password, id_role } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      return null;
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Utiliser l'id_role fourni ou attribuer le rôle par défaut (étudiant)
    const roleId = id_role ?? '67c8621008049ddd39d069f1';

    // Créer un nouvel utilisateur
    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      id_role: roleId,
      createdAt: new Date(),
    });

    return newUser.save();
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
