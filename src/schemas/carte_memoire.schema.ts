import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ collection: 'carte_memoire' })
export class CarteMemoire {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  réponse: string;

  @Prop({ required: true })
  niveau: string;

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
}
