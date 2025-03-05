/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CodeProfDocument = HydratedDocument<Code_prof>;

@Schema({ collection: 'code_prof'})
export class Code_prof {
  @Prop({ required: true, type: Number })
  code: number;
  
  @Prop({ required: true })
  nom: string;
}

export const CodeProfSchema = SchemaFactory.createForClass(Code_prof);