import { Injectable } from '@nestjs/common';
import { Model, UpdateQuery } from 'mongoose';

@Injectable()
export class SuperService<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>, model: Model<T>): Promise<T> {
    return model.create(data);
  }

  async findAll(model: Model<T>): Promise<T[]> {
    return model.find().exec();
  }

  async findOne(id: string, model: Model<T>): Promise<T | null> {
    return model.findById(id).exec();
  }

  async update(
    id: string,
    data: UpdateQuery<T>,
    model: Model<T>,
  ): Promise<T | null> {
    return model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string, model: Model<T>): Promise<T | null> {
    return model.findByIdAndDelete(id).exec();
  }
}