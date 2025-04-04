import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String })
  username: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String })
  password: string;
  @Prop({ default: 'active' })
  status: string;
  @Prop({ default: 'user' })
  type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
