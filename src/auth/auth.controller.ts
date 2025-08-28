/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

interface SessionUser {
  id: string;
  email: string;
  id_role: any;
  role: string;
}
// Add the @Controller() decorator to the AuthController class. | Ajouter le décorateur @Controller() à la classe AuthController.
@Controller('auth')

// Add the AuthController class. | Ajouter la classe AuthController.
export class AuthController {
  // Add the AuthService to the constructor. | Ajouter AuthService au constructeur.
  constructor(private readonly authService: AuthService) {}

  // Add the register() method to the AuthController class. | Ajouter la méthode register() à la classe
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    try {
      const user = await this.authService.register(registerDto);
  
      if (!user) {
        return { message: 'Un compte existe déjà avec cette adresse mail.' };
      }
  

  
      req.session.user = { id: user.id, email: user.email, id_role: user.id_role ?? '67c8621008049ddd39d069f1' } as SessionUser;
  
      return { message: 'Inscription réussie', user: req.session.user };
    } catch (error) {
      if (error.message === 'Code de sécurité invalide pour les professeurs.') {
        return { message: 'Le code prof n\'est pas valide.' };
      }
      // Gérer d'autres erreurs potentielles ici
      return { message: 'Une erreur est survenue lors de l\'inscription.' };
    }
  }
  


  // Méthode pour vérifier si le code est correct
  @Post('verifyCode')
  async verifyCode(@Body() { code }: { code: number }) {
    const isValid = await this.authService.isCodeValid(code);

    if (isValid) {
      return { message: 'Le code est correct.' };
    } else {
      return { message: 'Le code est incorrect.' };
    }
  }

  
  // Add the login() method to the AuthController class. | Ajouter la méthode login() à la classe AuthController.
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
  const { email, password } = loginDto;

  // Appeler le service d'authentification pour obtenir l'utilisateur et le nom du rôle
  const { user, role } = await this.authService.login(email, password);

  // Vérifier si l'utilisateur existe
  if (!user) {
    return { message: 'Identifiants incorrects' };
  }

  // Vérifier si la session est active
  if (!req.session) {
    return { message: "La session n'est pas active." };
  }

  // Stocker les informations de l'utilisateur dans la session
  req.session.user = {
    id: user._id,
    email: user.email,
    id_role: user.id_role,
    role: role, 
  } as SessionUser;

  // Retourner un message de succès avec les informations de l'utilisateur
  return { message: 'Connexion réussie', user: req.session.user };
}



  // Add the logout() method to the AuthController class. | Ajouter la méthode logout() à la classe AuthController.
  @Post('logout')
  logout(@Req() req: Request) {
    (req.session as any).destroy((err: any) => {
      if (err) {
        return { message: 'Erreur lors de la déconnexion', error: err };
      }
      return { message: 'Déconnexion réussie' };
    });
  }
}
