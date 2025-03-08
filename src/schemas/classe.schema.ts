import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'classe' })
export class Classe extends Document {
  @Prop({ required: true, unique: true })
  nom: string;
}

export const ClasseSchema = SchemaFactory.createForClass(Classe);
