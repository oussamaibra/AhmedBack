// src/invoice/dto/create-invoice.dto.ts
class InvoiceItemDto {
  stockId: string;
  magasinId: string;
  reference: string;
  nom: string;
  taille: number;
  quantity: number;
  prixAchat: number;
  prixVente: number;
}

export class CreateInvoiceDto {
  invoiceNumber?: string;
  date: string;
  customerId?: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: InvoiceItemDto[];
  subtotal: number;
  tax: number;
  total: number;
  notpayed: number;
  magasinId?: string;
  payed: number;
  status?: 'paid' | 'unpaid' | 'partially_paid';
  notes?: string;
}
