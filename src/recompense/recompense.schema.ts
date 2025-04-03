import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { RecompenseDTO, RecompenseOption } from './recompenseDTO';

export type RecompenseDocument = RecompenseDTO & Document;

@Schema()
export class Recompense {
  @Prop({ type: String })
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Etablissements' })
  etabId: string;
  @Prop({ type: String })
  status: string;

  @Prop({ type: Array })
  recompenseOption: RecompenseOption[];
}

export const Recompensesechema = SchemaFactory.createForClass(Recompense);
