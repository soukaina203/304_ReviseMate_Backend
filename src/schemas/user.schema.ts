import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//export type UserDocument = User & Document;

// Schema definition for the User model. | Définition du schéma pour le modèle User.
@Schema({ collection: 'utilisateur' })
export class User extends Document {
  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

// Export the User schema. | Exporter le schéma User.
export const UserSchema = SchemaFactory.createForClass(User);
