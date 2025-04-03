import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { IpInfoData, IpInfoDataDocument } from './IpInfoData.schema';

import * as moment from 'moment';
import { IpInfo } from './IpInfoDataDTO';
import { UserService } from 'src/user/user.service';

import { SocketGateway } from 'src/socketIO/socket.gateway';

@Injectable()
export class IpInfoDataService {
  constructor(
    @InjectModel('IpInfoData')
    private readonly IpInfoDataModule: Model<IpInfoDataDocument>,
  ) {}

  async addIpInfoData(IpInfoDataDto: IpInfo): Promise<any> {
    const newIpInfoData = await this.IpInfoDataModule.create({
      IpInfo: IpInfoDataDto,
    });
    return newIpInfoData.save();
  }

  async findIpInfoData(): Promise<IpInfoData[] | undefined> {
    const IpInfoDatas = await this.IpInfoDataModule.find().populate({
      path: 'IpInfo.userId',
      model: 'User',
      select: 'profileData',
    });
    if (!IpInfoDatas) {
      throw new HttpException(
        'No IpInfoDatas Done is Found for this User ',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return IpInfoDatas;
    }
  }
}
