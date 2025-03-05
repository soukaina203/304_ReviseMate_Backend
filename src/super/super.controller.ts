import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SuperService } from './super.service';

@Controller('super/:name')
export class SuperController<T> {
  constructor(private readonly superService: SuperService<T>) {}

  @Get()
  async findAll(): Promise<T[]> {
    return this.superService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    return this.superService.findOne(id);
  }

  @Post()
  async create(@Body() data: T): Promise<T> {
    return this.superService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: T): Promise<T> {
    return this.superService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<T> {
    return this.superService.delete(id);
  }
}
