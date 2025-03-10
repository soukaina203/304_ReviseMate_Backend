import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({ collection: 'quiz' })
export class Quiz {
  @Prop({ required: true })
  titre: string;

  @Prop({ required: false }) // Optionnel selon l'utilisation
  id_fiche: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
