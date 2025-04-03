import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MagasinDocument = Magasin & Document;

@Schema({ timestamps: true })
export class Magasin {
  @Prop({ required: true, trim: true })
  nom: string;

  @Prop({ required: true, trim: true })
  responsable: string;
}

export const MagasinSchema = SchemaFactory.createForClass(Magasin);
