// src/invoice/schemas/invoice.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  customerId?: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerAddress: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop([
    {
      stockId: { type: Types.ObjectId, ref: 'Stock', required: true },
      reference: { type: String, required: true },
      nom: { type: String, required: true },
      taille: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      prixAchat: { type: Number, required: true },
      prixVente: { type: Number, required: true },
    },
  ])
  items: {
    stockId: Types.ObjectId;
    reference: string;
    nom: string;
    taille: number;
    quantity: number;
    prixAchat: number;
    prixVente: number;
  }[];

  @Prop({ required: true, default: 0 })
  subtotal: number;

  @Prop({ required: true, default: 0 })
  tax: number;

  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ default: 'unpaid' })
  status: 'paid' | 'unpaid' | 'partially_paid';

  @Prop()
  notes?: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
