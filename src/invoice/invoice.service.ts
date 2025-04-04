import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './invoiceDTO';
import { Invoice, InvoiceDocument } from './invoice.schema';
import { Stock, StockDocument } from 'src/stock/stock.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
  ) {}

  async createInv(createInvoiceDto: CreateInvoiceDto): Promise<any> {
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

    const stockUpdatePromises = createInvoiceDto.items.map(
      (item) =>
        this.stockModel
          .findByIdAndUpdate(
            item.stockId,
            {
              $inc: {
                'quantite.$[elem].quantiteVendue': +item.quantity,
                // 'quantite.$[elem].quantiteInitiale': -item.quantity,
              },
            },
            {
              arrayFilters: [{ 'elem.magasinId': item.magasinId }],
            },
          )
          .exec(), // Don't forget exec() to return a proper promise
    );

    // Wait for all stock updates to complete
    await Promise.all(stockUpdatePromises);

    // const createdInvoice = await new this.invoiceModel(createInvoiceDto);
    // return createdInvoice.save();
    try {
      const newRecompense = await this.invoiceModel.create({
        ...createInvoiceDto,
      });
      return newRecompense.save();
    } catch (err) {
      console.error('eeeeeeeeeeeeeee', err);
    }
  }

  async findAll(filter: any): Promise<Invoice[]> {
    return this.invoiceModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async findByCustomer(customerId: string): Promise<Invoice[]> {
    return this.invoiceModel.find({ customerId }).exec();
  }

  async findByMagasin(magasinId: string): Promise<Invoice[]> {
    return this.invoiceModel.find({ 'items.magasinId': magasinId }).exec();
  }

  async update(
    id: string,
    updateInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    const updatedInvoice = await this.invoiceModel
      .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
      .exec();
    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return updatedInvoice;
  }

  async updateStatus(
    id: string,
    status: 'paid' | 'unpaid' | 'partially_paid',
  ): Promise<Invoice> {
    const updatedInvoice = await this.invoiceModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return updatedInvoice;
  }

  async remove(id: string): Promise<Invoice> {
    const deletedInvoice = await this.invoiceModel.findByIdAndDelete(id).exec();
    if (!deletedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return deletedInvoice;
  }

  async getInvoiceStats(): Promise<any> {
    return this.invoiceModel
      .aggregate([
        {
          $group: {
            _id: '$status',
            totalAmount: { $sum: '$total' },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();
  }

  async getMagasinStats(magasinId: string): Promise<any> {
    return this.invoiceModel
      .aggregate([
        { $unwind: '$items' },
        { $match: { 'items.magasinId': magasinId } },
        {
          $group: {
            _id: '$status',
            totalAmount: { $sum: '$total' },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();
  }
}
