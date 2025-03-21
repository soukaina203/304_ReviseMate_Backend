import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Si aucun rôle n'est requis, l'accès est autorisé
    }

    const request = context.switchToHttp().getRequest();
    const user = request.session.user; // Utilisation de la session pour récupérer l'utilisateur

    console.log('Utilisateur dans la session :', user); // Pour debug

    // Si l'utilisateur n'a pas de rôle ou si son rôle ne correspond pas à l'un des rôles requis, l'accès est refusé
    return user && requiredRoles.includes(user.role);
  }
}
