import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { Etablissements, EtablissementDocument } from './etablissement.schema';
import * as moment from 'moment';
import { EtablissementDTO } from './etablissementDTO';
@Injectable()
export class EtablissementService {
  constructor(
    @InjectModel('Etablissements')
    private readonly EtablissementModule: Model<EtablissementDocument>,
  ) {}

  async addEtablissement(EtablissementDto: EtablissementDTO): Promise<any> {
    const newEtablissement = await this.EtablissementModule.create({
      ...EtablissementDto,
    });
    return newEtablissement.save();
  }

  async findEtablissement(): Promise<any[] | undefined> {
    const listEtablissements = await this.EtablissementModule.find();

    if (!listEtablissements) {
      throw new HttpException(
        'No Etablissements Done is Found for this User ',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return listEtablissements;
    }
  }

  async updateEtablissement(
    EtablissementDto: EtablissementDTO,
    id: string,
  ): Promise<any> {
    try {
      const updatedEtablissement =
        await this.EtablissementModule.findByIdAndUpdate(id, EtablissementDto, {
          new: true,
        });

      if (!updatedEtablissement) {
        throw new HttpException(
          'Etablissement not found ',
          HttpStatus.NOT_FOUND,
        );
      }

      return updatedEtablissement;
    } catch (error) {
      throw new Error(`Failed to update Etablissement: ${error.message}`);
    }
  }
}
