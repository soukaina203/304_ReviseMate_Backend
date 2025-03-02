import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

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
}
