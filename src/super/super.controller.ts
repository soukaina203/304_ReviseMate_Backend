import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Inject,
} from '@nestjs/common';
import { SuperService } from './super.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('super/:name')
export class SuperController<T> {
  private model: Model<T>;

  constructor(
    @Inject(SuperService) private readonly superService: SuperService<T>,
    @Inject(getModelToken('Fiche')) private readonly ficheModel: Model<T>,
    @Inject(getModelToken('Quiz')) private readonly quizModel: Model<T>,
    @Inject(getModelToken('Question')) private readonly questionModel: Model<T>,
    @Inject(getModelToken('User')) private readonly userModel: Model<T>,
    @Inject(getModelToken('Classe')) private readonly classeModel: Model<T>,
  ) {}

  private getModel(name: string): Model<T> {
    if (name === 'fiche') return this.ficheModel;
    if (name === 'quiz') return this.quizModel;
    if (name === 'question') return this.questionModel;
    if (name === 'user') return this.userModel;
    if (name === 'classe') return this.classeModel;
    throw new Error(`Modèle inconnu: ${name}`);
  }

  @Get()
  async findAll(@Param('name') name: string): Promise<T[]> {
    return this.superService.findAll(this.getModel(name));
  }

  @Get(':id')
  async findOne(
    @Param('name') name: string,
    @Param('id') id: string,
  ): Promise<T> {
    return this.superService.findOne(id, this.getModel(name));
  }

  @Post()
  async create(@Param('name') name: string, @Body() data: T): Promise<T> {
    return this.superService.create(data, this.getModel(name));
  }

  @Patch(':id')
  async update(
    @Param('name') name: string,
    @Param('id') id: string,
    @Body() data: T,
  ): Promise<T> {
    return this.superService.update(id, data, this.getModel(name));
  }

  @Delete(':id')
  async delete(
    @Param('name') name: string,
    @Param('id') id: string,
  ): Promise<T> {
    return this.superService.delete(id, this.getModel(name));
  }
}
