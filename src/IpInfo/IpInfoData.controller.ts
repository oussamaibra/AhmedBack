import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  NotFoundException,
  Delete,
  BadRequestException,
  Ip,
  Headers,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard.ts';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { IpInfoDataService } from './IpInfoData.service';
import { IpInfo } from './IpInfoDataDTO';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/IpInfoData')
@UseInterceptors(CacheInterceptor)
export class IpInfoDataController {
  constructor(private IpInfoDataService: IpInfoDataService) {}

  @Post('/')
  async addIpInfoData(@Body() IpInfoDataDto: IpInfo) {
    const appliaction = await this.IpInfoDataService.addIpInfoData(
      IpInfoDataDto,
    );
    return appliaction;
  }

  @Get('/')
  async getIpInfoData() {
    const appliaction = await this.IpInfoDataService.findIpInfoData();
    return appliaction;
  }
}
