import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ collection: 'carte_memoire' })
export class CarteMemoire extends Document {
  @Prop({ required: true })
  titre: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'id_fiche',
  })
  id_fiche: Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'id_utilisateur',
  })
  id_utilisateur: Types.ObjectId;

  @Prop({
    type: [
      {
        question: String,
        réponse: String,
      },
    ],
    required: true,
  })
  questions_reponses: { question: string; réponse: string }[];
}

export const CarteMemoireSchema = SchemaFactory.createForClass(CarteMemoire);
