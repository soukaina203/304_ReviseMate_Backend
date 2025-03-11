import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
//import * as bcrypt from 'bcrypt';
export type UserDocument = User & Document;

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

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'Classe' })
  id_classe: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  id_role: MongooseSchema.Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

// Export the User schema. | Exporter le schéma User.
export const UserSchema = SchemaFactory.createForClass(User);

/* Hook pour gérer le hachage du mdp
UserSchema.pre('save', async function (next) {
  const user = this as any; // cast as any to avoid typing issues

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});*/
