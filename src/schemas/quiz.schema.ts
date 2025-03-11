import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from "mongoose";

export type QuizDocument = Quiz & Document;

@Schema({ collection: 'quiz' })
export class Quiz {
  @Prop({ required: true })
  titre: string;

  @Prop({ required: false }) // Optionnel selon l'utilisation
  id_fiche: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'id_utilisateur',
  })
  id_utilisateur: Types.ObjectId;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
