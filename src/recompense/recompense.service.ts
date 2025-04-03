import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { Recompense, RecompenseDocument } from './recompense.schema';
import * as moment from 'moment';
import { RecompenseDTO } from './recompenseDTO';
@Injectable()
export class RecompenseService {
  constructor(
    @InjectModel('Recompense')
    private readonly RecompenseModule: Model<RecompenseDocument>,
  ) {}

  async addRecompense(RecompenseDto: RecompenseDTO): Promise<any> {
    const newRecompense = await this.RecompenseModule.create({
      ...RecompenseDto,
    });
    return newRecompense.save();
  }

  async findRecompense(): Promise<any[] | undefined> {
    const listRecompenses = await this.RecompenseModule.find();

    if (!listRecompenses) {
      throw new HttpException(
        'No Recompenses Done is Found for this User ',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return listRecompenses;
    }
  }

  async updateRecompense(
    RecompenseDto: RecompenseDTO,
    id: string,
  ): Promise<any> {
    try {
      const updatedRecompense = await this.RecompenseModule.findByIdAndUpdate(
        id,
        RecompenseDto,
        {
          new: true,
        },
      );

      if (!updatedRecompense) {
        throw new HttpException('Recompense not found ', HttpStatus.NOT_FOUND);
      }

      return updatedRecompense;
    } catch (error) {
      throw new Error(`Failed to update Recompense: ${error.message}`);
    }
  }
}
