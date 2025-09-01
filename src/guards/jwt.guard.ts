import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token manquant');
    }

    // Le header doit être sous la forme "Bearer <token>"
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Format de token invalide');
    }

    try {
      // Vérifie et décode le JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'secret_key',
      });

      // Attache les infos du user à la requête
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
