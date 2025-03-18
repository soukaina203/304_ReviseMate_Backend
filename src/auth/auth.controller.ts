/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

interface SessionUser {
  id: string;
  email: string;
  id_role: any;
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
    const user = await this.authService.register(registerDto);
    
    if (!user) {
      return { message: 'Un compte existe déjà avec cette adresse mail.' };
    }

    if (!req.session) {
      return { message: "La session n'est pas active." };
    }

    
    req.session.user = { id: user.id, email: user.email, id_role: user.id_role ?? '67c8621008049ddd39d069f1' };

    return { message: 'Inscription réussie', user: req.session.user };
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
    // Extraire les informations de l'objet loginDto
    const { email, password } = loginDto;

    // Vérifie si l'utilisateur existe
    const user = await this.authService.login(email, password);
    if (!user) {
      return { message: 'Identifiants incorrects' };
    }

    // Check if the session is active | Vérifie si la session est bien active
    if (!req.session) {
      return { message: "La session n'est pas active." };
    }

    // Register the user in session  | Enregistrer l'utilisateur en session
    req.session.user = { id: user.id, email: user.email, id_role: user.id_role } as SessionUser;
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
