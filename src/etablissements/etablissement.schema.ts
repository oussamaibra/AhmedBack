import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Coordinate, EtablissementDTO, SolialMedia } from './etablissementDTO';

export type EtablissementDocument = EtablissementDTO & Document;

@Schema()
export class Etablissements {
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  avatar: string;
  @Prop({ type: String })
  couverture: string;
  @Prop({ type: String })
  rating: string;
  @Prop({ type: String })
  multimedia: string;

  @Prop({ type: String })
  ville: string;
  @Prop({ type: String })
  codePostal: string;
  @Prop({ type: String })
  location: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  phone: string;
  @Prop({ type: String })
  minPrice: string;
  @Prop({ type: String })
  maxPrice: string;
  @Prop({ type: Coordinate })
  coordinate: Coordinate;

  @Prop({ type: Array })
  solialMedia: SolialMedia[];
  @Prop({ type: String })
  nbfollowersMin: string;
  @Prop({ type: String, default: '72' })
  nbhoursMin: string;
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Recompense',
  // })
  @Prop({ type: String })
  recId: string;
}

export const EtablissementSchema = SchemaFactory.createForClass(Etablissements);
