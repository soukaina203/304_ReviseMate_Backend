import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import { UserService } from '../features/user/user.service';
import { SuperService } from '../super/super.service';
import { AuthService } from '../auth/auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from '../auth/dto/register.dto';
import { Update_userDto } from '../auth/dto/update_user.dto';

@Controller('admin/user')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly superService: SuperService<User>,
    private readonly authService: AuthService,
    @Inject(getModelToken('User')) private readonly userModel: Model<User>,
  ) {}

  @Get()
  async getAllUsers() {
    try {
      const users = await this.superService.findAll(this.userModel);
      return {
        success: true,
        message: 'Liste des utilisateurs récupérée avec succès.',
        data: users,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des utilisateurs',
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.superService.findOne(id, this.userModel);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé.`);
    }
    try {
      return {
        success: true,
        message: 'Utilisateur trouvé.',
        data: user,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la récupération de l'utilisateur",
      );
    }
  }

  @Post()
  async createUser(@Body() createUserDto: RegisterDto) {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUser) {
      throw new BadRequestException(
        'Un compte existe déjà avec cette adresse mail.',
      );
    }
    try {
      const newUser = await this.authService.register(createUserDto);

      return {
        success: true,
        message: 'Utilisateur créé avec succès.',
        data: newUser,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la création de l'utilisateur",
      );
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Update_userDto,
  ) {
    try {
      const updatedUser = await this.userService.update(id, updateUserDto);
      return {
        success: true,
        message: 'Utilisateur mis à jour avec succès.',
        data: updatedUser,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la mise à jour de l'utilisateur",
      );
    }
  }

  // DELETE user (optional: SuperService is fine)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.superService.delete(id, this.userModel);
    if (!deletedUser) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé.`);
    }
    try {
      return {
        success: true,
        message: 'Utilisateur supprimé avec succès.',
        data: deletedUser,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la suppression de l'utilisateur",
      );
    }
  }
}
