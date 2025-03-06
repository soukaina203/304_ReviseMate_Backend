import { Injectable } from '@nestjs/common';
import { Model, UpdateQuery } from 'mongoose';

@Injectable()
export class SuperService<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<T> {
    return this.model.findById(id).exec();
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T> | null {
    return this.model.findByIdAndUpdate(id, data).exec();
  }

  async delete(id: string): Promise<T> | null {
    return this.model.findByIdAndDelete(id).exec();
  }
  
}
