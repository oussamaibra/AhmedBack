import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Magasin, MagasinDocument } from './magasin.schema';
import { MagasinDTO } from './magasinDTO';

@Injectable()
export class MagasinService {
  constructor(
    @InjectModel(Magasin.name) private magasinModel: Model<MagasinDocument>,
  ) {}

  async create(createMagasinDto: MagasinDTO): Promise<Magasin> {
    const createdMagasin = new this.magasinModel(createMagasinDto);
    return createdMagasin.save();
  }

  async findAll(): Promise<Magasin[]> {
    return this.magasinModel.find().exec();
  }

  async findOne(id: string): Promise<Magasin> {
    return this.magasinModel.findById(id).exec();
  }

  async update(id: string, updateMagasinDto: MagasinDTO): Promise<Magasin> {
    return this.magasinModel
      .findByIdAndUpdate(id, updateMagasinDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Magasin> {
    return this.magasinModel.findByIdAndDelete(id).exec();
  }
}
