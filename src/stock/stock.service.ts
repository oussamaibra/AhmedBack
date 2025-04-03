import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from './stock.schema';
import { StockDTO } from './stockDTO';

@Injectable()
export class StockService {
  constructor(@InjectModel('Stock') private stockModel: Model<StockDocument>) {}

  async create(createStockDto: StockDTO): Promise<Stock> {
    const createdStock = new this.stockModel(createStockDto);
    return createdStock.save();
  }

  async findAll(): Promise<Stock[]> {
    return this.stockModel
      .find()

      .exec();
  }

  async findOne(id: string): Promise<Stock> {
    return this.stockModel.findById(id).exec();
  }

  async update(id: string, updateStockDto: StockDTO): Promise<Stock> {
    return this.stockModel
      .findByIdAndUpdate(id, updateStockDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Stock> {
    return this.stockModel.findByIdAndDelete(id).exec();
  }

  // Custom query example
  async findByMagasin(magasinId: string): Promise<Stock[]> {
    return this.stockModel.find({ magasinId }).exec();
  }

  async findByTaille(taille: number): Promise<Stock[]> {
    return this.stockModel.find({ taille }).exec();
  }
}
