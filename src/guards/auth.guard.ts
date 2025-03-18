// src/auth/auth.guard.ts
import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Vérifie si l'utilisateur est connecté (par exemple via la session)
    if (!request.session || !request.session.user) {
      // Si non connecté, on autorise l'accès aux pages publiques seulement
      const url = request.url;
      if (url === '/login' || url === '/register' || url === '/') {
        return true;  // Autoriser l'accès aux pages publiques
      }
      return false;  // Bloquer l'accès aux autres pages
    }
    
    return true;  // L'utilisateur est connecté, il peut accéder à la route
  }
}
