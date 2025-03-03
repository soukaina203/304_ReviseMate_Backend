import { Controller, Get, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';

// Add the @Controller() decorator to the UsersController class. | Ajouter le décorateur @Controller() à la classe UsersController.
@Controller('users')

// Add the UsersController class. | Ajouter la classe UsersController.
export class UsersController {
  // Add the UsersService to the constructor. | Ajouter UsersService au constructeur.
  constructor(private readonly usersService: UsersService) {}

  // Add the findAll() method to the UsersController class. | Ajouter la méthode findAll() à la classe UsersController.
  @Get()
  async findAll() {
    // Call the findAll() method from the UsersService class. | Appeler la méthode findAll() de la classe UsersService.
    return this.usersService.findAll();
  }

  // Add the deleteUser() method to the UsersController class. | Ajouter la méthode deleteUser() à la classe UsersController.
  @Delete(':email')
  async deleteUser(@Param('email') email: string) {
    // Call the deleteUserByEmail() method from the UsersService class. | Appeler la méthode deleteUserByEmail() de la classe UsersService.
    return this.usersService.deleteUserByEmail(email);
  }
}
