import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

// Add the @Controller() decorator to the AuthController class. | Ajouter le décorateur @Controller() à la classe AuthController.
@Controller('auth')

// Add the AuthController class. | Ajouter la classe AuthController.
export class AuthController {
  // Add the AuthService to the constructor. | Ajouter AuthService au constructeur.
  constructor(private readonly authService: AuthService) {}

  // Add the register() method to the AuthController class. | Ajouter la méthode register() à la classe
  @Post('register')
  // Add the @Body() decorator to the register() method. | Ajouter le décorateur @Body() à la méthode register().
  async register(@Body() registerDto: RegisterDto) {
    // Call the register() method from the AuthService class. | Appeler la méthode register() de la classe AuthService.
    return this.authService.register(registerDto);
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
  
    // Vérifie si la session est bien active | Check if the session is active
    if (!req.session) {
      return { message: 'La session n\'est pas active.' };
    }
  
    // Enregistrer l'utilisateur en session
    req.session.user = { id: user.id, email: user.email };
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
