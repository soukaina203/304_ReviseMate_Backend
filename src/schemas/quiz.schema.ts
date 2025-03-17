import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ collection: 'quiz' })
export class Quiz extends Document {
  @Prop({ required: true })
  titre: string;

  @Prop({ required: false })
  id_fiche: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'id_utilisateur',
  })
  id_utilisateur: Types.ObjectId;

  @Prop({ default: [] })
  scores: { userId: Types.ObjectId; correctAnswers: number; totalQuestions: number; date: Date }[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
