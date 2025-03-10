import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type FicheDocument = Fiche & Document;

@Schema({ collection: 'fiche' })
export class Fiche {
  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  contenu: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'id_cours',
  })
  id_cours: Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'id_utilisateur',
  })
  id_utilisateur: Types.ObjectId;

  @Prop()
  date_creation: Date;
}

export const FicheSchema = SchemaFactory.createForClass(Fiche);
