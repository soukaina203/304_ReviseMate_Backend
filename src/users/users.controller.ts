import { Controller, Get, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Delete(':email')
  async deleteUser(@Param('email') email: string) {
    return this.usersService.deleteUserByEmail(email);
  }
}
