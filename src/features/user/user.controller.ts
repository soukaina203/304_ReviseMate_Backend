import { Controller,Get, Put, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Update_userDto } from '../../auth/dto/update_user.dto';
import { User } from '../../schemas/user.schema';
import { AuthGuard } from '../../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('super/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Update a user | Mettre à jour un utilisateur
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: Update_userDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Get('etudiants/details')
  @UseGuards(AuthGuard)
  async getAllEtudiantsWithDetails() {
    return this.userService.getAllEtudiantsWithDetails();
  }
}
