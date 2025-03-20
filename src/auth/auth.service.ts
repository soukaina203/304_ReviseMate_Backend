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
    const { firstName, lastName, email, password, role, code_prof } = registerDto;
  
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      return null;
    }
  
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);
  
    // Définir l'ID du rôle en fonction du rôle fourni
    let roleId: string;
  
    if (role === 'professeur') {
      if (!code_prof || !(await this.isCodeValid(Number(code_prof)))) {
        throw new Error('Code de sécurité invalide pour les professeurs.');
      }
      roleId = '67bde3d6d528fe1ec83f0316'; // ID du rôle professeur
    } else {
      roleId = '67c8621008049ddd39d069f1'; // ID du rôle étudiant (par défaut)
    }
  
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
  
  


  async login(email: string, password: string): Promise<{ user: UserDocument | null, role: string | null }> {
    // Recherche l'utilisateur dans la base de données par email
    const user = await this.userModel.findOne({ email }).exec();
  
    // Vérifie si l'utilisateur existe
    if (!user) {
      return { user: null, role: null }; // Utilisateur non trouvé
    }
  
    // Vérifie si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return { user: null, role: null }; // Mot de passe incorrect
    }
  
    // Mapper les IDs de rôle à leurs noms respectifs
    const roleMapping: { [key: string]: string } = {
      '67bde3d6d528fe1ec83f0316': 'professeur',
      '67c8621008049ddd39d069f1': 'étudiant',
      '67c8621008049ddd39d069f2': 'admin', 
    };
  
    // Vérifie si user.id_role est défini avant de le convertir en string
    if (!user.id_role) {
      return { user, role: null }; // Pas de rôle associé à l'utilisateur
    }
  
    // Convertir l'ObjectId en string pour l'utiliser comme clé
    const roleIdString = user.id_role.toString();
  
    // Obtenir le nom du rôle à partir de l'ID
    const role = roleMapping[roleIdString];
  
    return { user, role }; // Utilisateur trouvé et mot de passe valide
  }
  
  
}
