import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ collection: 'role' })
export class Role {
  @Prop({ required: true, unique: true })
  nom: string;

  @Prop({ required: true, unique: true })
  id_role: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
