/* eslint-disable prettier/prettier */
import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ---------- Register ----------
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      const user = await this.authService.register(registerDto);

      if (!user) {
        return { success: false, message: 'Un compte existe déjà avec cette adresse mail.' };
      }

      // Générer le token immédiatement après inscription
      const token = await this.authService.generateJwt({
        id: user.id,
        email: user.email,
        id_role: user.id_role ?? '67c8621008049ddd39d069f1',
        role: user.role ?? 'student',
      });

      return {
        success: true,
        message: 'Inscription réussie',
        token,
        user: {
          id: user.id,
          email: user.email,
          id_role: user.id_role,
          role: user.role,
        },
      };
    } catch (error) {
      if (error.message === 'Code de sécurité invalide pour les professeurs.') {
        return { success: false, message: 'Le code prof n\'est pas valide.' };
      }
      throw new HttpException(
        { success: false, message: 'Erreur lors de l\'inscription', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------- Vérification du code ----------
  @Post('verifyCode')
  async verifyCode(@Body() { code }: { code: number }) {
    const isValid = await this.authService.isCodeValid(code);

    return {
      success: isValid,
      message: isValid ? 'Le code est correct.' : 'Le code est incorrect.',
    };
  }

  // ---------- Login ----------
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const { email, password } = loginDto;

      const { user, role } = await this.authService.login(email, password);

      if (!user) {
        throw new HttpException(
          { success: false, message: 'Identifiants incorrects' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = await this.authService.generateJwt({
        id: user._id,
        email: user.email,
        id_role: user.id_role,
        role,
      });

      return {
        success: true,
        message: 'Connexion réussie',
        token,
        user: {
          id: user._id,
          email: user.email,
          id_role: user.id_role,
          role,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { success: false, message: 'Erreur lors de la connexion', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------- Logout ----------
  // ⚠️ Avec JWT, pas de vraie déconnexion côté serveur.
  // On se contente de dire au client de supprimer son token.
  @Post('logout')
  logout(): AuthResponse {
    return { success: true, message: 'Déconnexion réussie (supprimez simplement le token côté client)' };
  }

  // ---------- Exemple de route protégée ----------
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req): any {
    return { success: true, user: req.user };
  }
}
