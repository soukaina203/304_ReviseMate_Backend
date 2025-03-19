import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SuperService } from './super.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthGuard } from '../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('super/:name')
export class SuperController<T> {
  private model: Model<T>;

  constructor(
    @Inject(SuperService) protected readonly superService: SuperService<T>,
    @Inject(getModelToken('Fiche')) private readonly ficheModel: Model<T>,
    @Inject(getModelToken('Quiz')) private readonly quizModel: Model<T>,
    @Inject(getModelToken('Question')) private readonly questionModel: Model<T>,
    @Inject(getModelToken('User')) private readonly userModel: Model<T>,
    @Inject(getModelToken('Classe')) private readonly classeModel: Model<T>,
    @Inject(getModelToken('Carte_memoire'))
    private readonly carte_memoireModel: Model<T>,
    @Inject(getModelToken('Role')) private readonly roleModel: Model<T>,
  ) {}

  private getModel(name: string): Model<T> {
    if (name === 'fiche') return this.ficheModel;
    if (name === 'quiz') return this.quizModel;
    if (name === 'question') return this.questionModel;
    if (name === 'user') return this.userModel;
    if (name === 'classe') return this.classeModel;
    if (name === 'carte_memoire') return this.carte_memoireModel;
    if (name === 'role') return this.roleModel;
    throw new Error(`Modèle inconnu: ${name}`);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Param('name') name: string): Promise<{
    success: boolean;
    message: string;
    data?: T[];
  }> {
    try {
      const data = await this.superService.findAll(this.getModel(name));
      return {
        success: true,
        message: 'Données récupérées avec succès',
        data,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Impossible de récupérer les données',
      });
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('name') name: string,
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    message: string;
    data?: T;
  }> {
    try {
      const data = await this.superService.findOne(id, this.getModel(name));
      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Données non trouvées.',
        });
      }
      return {
        success: true,
        message: 'Données récupérées avec succès',
        data,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Impossible de récupérer les données',
      });
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Param('name') name: string,
    @Body() data: T,
  ): Promise<{
    success: boolean;
    message: string;
    data?: T;
  }> {
    try {
      const createdData = await this.superService.create(
        data,
        this.getModel(name),
      );
      return {
        success: true,
        message: 'Données créées avec succès',
        data: createdData,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Impossible de créer les données.',
      });
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('name') name: string,
    @Param('id') id: string,
    @Body() data: Partial<T>,
  ): Promise<{
    success: boolean;
    message: string;
    data?: T;
  }> {
    try {
      const updatedData = await this.superService.update(
        id,
        data,
        this.getModel(name),
      );
      if (!updatedData) {
        throw new NotFoundException({
          success: false,
          message: 'Données non trouvées.',
        });
      }
      return {
        success: true,
        message: 'Données mises à jour avec succès.',
        data: updatedData,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Impossible de mettre à jour les données.',
      });
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @Param('name') name: string,
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    message: string;
    data?: T;
  }> {
    try {
      const deletedData = await this.superService.delete(
        id,
        this.getModel(name),
      );
      if (!deletedData) {
        throw new NotFoundException({
          success: false,
          message: 'Données non trouvées.',
        });
      }
      return {
        success: true,
        message: 'Données supprimmées avec succès.',
        data: deletedData,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Impossible de supprimer les données.',
      });
    }
  }
}
