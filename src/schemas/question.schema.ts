import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ collection: 'question' })
export class Question {
  @Prop({ required: true })
  texte: string;

  @Prop({ required: true })
  réponse: string;

  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true }) // Référence au Quiz
  id_quiz: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
