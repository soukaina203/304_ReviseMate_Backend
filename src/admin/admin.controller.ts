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
  UseGuards,  // Importer UseGuards
} from '@nestjs/common';

import { UserService } from '../features/user/user.service';
import { SuperService } from '../super/super.service';
import { AuthService } from '../auth/auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from '../auth/dto/register.dto';
import { Update_userDto } from '../auth/dto/update_user.dto';
import { Roles } from '../guards/roles.decorator';
import { RoleGuard } from '../guards/role.guard';

@Controller('admin/user')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly superService: SuperService<User>,
    private readonly authService: AuthService,
    @Inject(getModelToken('User')) private readonly userModel: Model<User>,
  ) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles('admin')  
  async getAllUsers() {
    try {
      const users = await this.superService.findAll(this.userModel);
      return {
        success: true,
        message: 'Liste des utilisateurs récupérée avec succès.',
        data: users,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des utilisateurs',
      );
    }
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles('admin')
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
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la récupération de l'utilisateur",
      );
    }
  }

  @Post()
  @UseGuards(RoleGuard)  // Appliquer le RoleGuard pour cette route
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
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la création de l'utilisateur",
      );
    }
  }

  @Patch(':id')
  @UseGuards(RoleGuard)  // Appliquer le RoleGuard pour cette route
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
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la mise à jour de l'utilisateur",
      );
    }
  }

  @Delete(':id')
  @UseGuards(RoleGuard)  // Appliquer le RoleGuard pour cette route
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
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la suppression de l'utilisateur",
      );
    }
  }
}
