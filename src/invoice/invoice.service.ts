// src/invoice/invoice.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';
import { Stock, StockDocument } from 'src/stock/stock.schema';
import { CreateInvoiceDto } from './invoiceDTO';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Generate invoice number if not provided
    if (!createInvoiceDto.invoiceNumber) {
      const lastInvoice = await this.invoiceModel
        .findOne()
        .sort({ createdAt: -1 })
        .exec();
      const lastNumber = lastInvoice
        ? parseInt(lastInvoice.invoiceNumber.split('-')[1])
        : 0;
      createInvoiceDto.invoiceNumber = `INV-${(lastNumber + 1)
        .toString()
        .padStart(5, '0')}`;
    }

    // Update stock quantities
    for (const item of createInvoiceDto.items) {
      await this.stockModel.findByIdAndUpdate(
        item.stockId,
        {
          $inc: { 'quantite.$[elem].quantiteDisponible': -item.quantity },
        },
        {
          arrayFilters: [{ 'elem.magasinId': 'default' }], // Adjust based on your magasin structure
        },
      );
    }

    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    return createdInvoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findOne(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(id).exec();
  }

  async update(
    id: string,
    updateInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    // For a complete implementation, you would need to handle stock quantity adjustments
    // when items are changed in the invoice
    return this.invoiceModel
      .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Invoice> {
    // Before deleting, you might want to restore stock quantities
    const invoice = await this.invoiceModel.findById(id).exec();
    if (invoice) {
      for (const item of invoice.items) {
        await this.stockModel.findByIdAndUpdate(
          item.stockId,
          {
            $inc: { 'quantite.$[elem].quantiteDisponible': item.quantity },
          },
          {
            arrayFilters: [{ 'elem.magasinId': 'default' }], // Adjust based on your magasin structure
          },
        );
      }
    }
    return this.invoiceModel.findByIdAndDelete(id).exec();
  }

  async findByCustomer(customerId: string): Promise<Invoice[]> {
    return this.invoiceModel.find({ customerId }).exec();
  }

  async getInvoiceStats(): Promise<{
    totalSales: number;
    paidInvoices: number;
    outstanding: number;
  }> {
    const result = await this.invoiceModel.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' },
          paidInvoices: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, 1, 0],
            },
          },
        },
      },
    ]);

    const stats = result[0] || { totalSales: 0, paidInvoices: 0 };
    return {
      totalSales: stats.totalSales,
      paidInvoices: stats.paidInvoices,
      outstanding: stats.totalSales - (await this.getTotalPaidAmount()),
    };
  }

  private async getTotalPaidAmount(): Promise<number> {
    const result = await this.invoiceModel.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    return result[0]?.total || 0;
  }
}
