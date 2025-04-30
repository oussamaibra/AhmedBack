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

  async createMany(data: any[]): Promise<any> {
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format. Expected an array of stock items.');
    }
    const stockEntries = data.map((item) => ({
      nom: item?.ref,
      reference: item?.ref,
      image: item.image || null,
      prixAchat: Number(item.prixachat) || 0,
      prixVente: Number(item.prixvante) || 0,
      taille: 1,
      quantite: [
        {
          quantiteInitiale: Number(item.quantite) || 0,
          quantiteVendue: 0,
          quantitePerdue: 0,
          magasinId: null,
        },
      ],
    }));

    console.log('📦 Mapped stock data:', stockEntries.length);
    return this.stockModel.insertMany(stockEntries);
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
