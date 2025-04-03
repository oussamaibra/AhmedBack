import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CheckDocument = Check & Document;

@Schema({ timestamps: true })
export class Check {
  @Prop({ required: true, trim: true })
  nom: string;

  @Prop({ required: true, unique: true, trim: true })
  numCheck: string;

  @Prop({ required: true, trim: true })
  nomPersonne: string;

  @Prop({ required: true })
  dateCheck: Date;

  @Prop({ required: true })
  dateDepotCheck: Date;

  @Prop({ required: true })
  montant_in: number;

  @Prop({ required: true })
  montant_ou: number;

  @Prop({
    required: true,
    enum: ['validé', 'rejeté'],
    default: 'init',
  })
  status: string;
}

export const CheckSchema = SchemaFactory.createForClass(Check);
