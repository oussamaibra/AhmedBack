import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import mongoose, { Document } from 'mongoose';
import { IpInfo } from './IpInfoDataDTO';
import { User } from 'src/user/user.schema';

export type IpInfoDataDocument = IpInfoData & Document;

@Schema()
export class IpInfoData {
  @Prop()
  IpInfo: IpInfo;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;
}

export const IpInfoDataSchema = SchemaFactory.createForClass(IpInfoData);
