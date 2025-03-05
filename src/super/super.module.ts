import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { SuperService } from './super.service';
import { SuperController } from './super.controller';
import mongoose, { Model } from 'mongoose';

@Module({})
export class SuperModule {
  static forFeature<T>(model: mongoose.Schema, name: string): DynamicModule {
    return {
      module: SuperModule,
      imports: [MongooseModule.forFeature([{ name, schema: model }])],
      providers: [
        {
          provide: SuperService,
          useFactory: (modelInstance: Model<T>) =>
            new SuperService<T>(modelInstance),
          inject: [getModelToken(name)],
        },
      ],
      controllers: [SuperController],
      exports: [SuperService],
    };
  }
}
