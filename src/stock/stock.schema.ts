import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StockByMagasin } from './stockDTO';

export type StockDocument = Stock & Document;

@Schema({ timestamps: true })
export class Stock {
  @Prop({ required: true, trim: true })
  nom: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  reference: string;

  @Prop({ required: true, min: 1, max: 6 })
  taille: number;

  @Prop({ required: true, min: 0, default: 0 })
  prixAchat: number;

  @Prop({ required: true, min: 0, default: 0 })
  prixVente: number;

  // @Prop({ required: true, default: 0, min: 0 })
  // quantiteInitiale: number;

  // @Prop({ required: true, default: 0, min: 0 })
  // quantiteVendue: number;

  // @Prop({ required: true, default: 0, min: 0 })
  // quantitePerdue: number;
  @Prop({ type: Array, required: true })
  quantite: StockByMagasin[];

  // // Virtuals
  // quantiteDisponible?: number;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

// // Add virtual property
// StockSchema.virtual('quantiteDisponible').get(function (this: StockDocument) {
//   return this.quantiteInitiale - this.quantiteVendue - this.quantitePerdue;
// });
