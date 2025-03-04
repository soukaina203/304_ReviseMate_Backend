/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type code_prof = HydratedDocument<Code_prof>;

@Schema()
export class Code_prof {
  @Prop({ required: true })
  code: number;

  @Prop({ required: true })
  nom: string;
}

export const code_prof = SchemaFactory.createForClass(Code_prof);
