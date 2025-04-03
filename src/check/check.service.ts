import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Check, CheckDocument } from './check.schema';
import { CheckDTO } from './checkDTO';

@Injectable()
export class CheckService {
  constructor(
    @InjectModel(Check.name) private checkModel: Model<CheckDocument>,
  ) {}

  async create(createCheckDto: CheckDTO): Promise<Check> {
    const createdCheck = new this.checkModel({
      ...createCheckDto,
      dateCheck: new Date(createCheckDto.dateCheck),
      dateDepotCheck: new Date(createCheckDto.dateDepotCheck),
    });
    return createdCheck.save();
  }

  async findAll(): Promise<Check[]> {
    return this.checkModel.find().exec();
  }

  async findOne(id: string): Promise<Check> {
    return this.checkModel.findById(id).exec();
  }

  async findByNumCheck(numCheck: string): Promise<Check> {
    return this.checkModel.findOne({ numCheck }).exec();
  }

  async update(id: string, updateCheckDto: CheckDTO): Promise<Check> {
    const updateData: any = { ...updateCheckDto };

    if (updateCheckDto.dateCheck) {
      updateData.dateCheck = new Date(updateCheckDto.dateCheck);
    }
    if (updateCheckDto.dateDepotCheck) {
      updateData.dateDepotCheck = new Date(updateCheckDto.dateDepotCheck);
    }

    return this.checkModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Check> {
    return this.checkModel.findByIdAndDelete(id).exec();
  }

  async findByStatus(status: string): Promise<Check[]> {
    return this.checkModel.find({ status }).exec();
  }
}
