import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { link } from './dtos/create-user-dto';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String })
  avatar: string;
  @Prop({ type: String })
  usernameInsta: string;
  @Prop({ type: String })
  username: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String })
  gender: string;

  @Prop({ type: String })
  phone: string;
  @Prop({ type: String })
  contact: string;

  @Prop({ type: String })
  password: string;
  @Prop({ default: 'active' })
  status: string;
  @Prop({ default: 'user', enum: ['user', 'admin', 'restaurant'] })
  type: string;

  @Prop({ default: false })
  firstLogin: boolean;

  @Prop({ default: false })
  changePass: boolean;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop({ type: String })
  isOnlineTime: string;

  @Prop({ type: String })
  ville: string;

  @Prop({ type: String })
  codePostal: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
