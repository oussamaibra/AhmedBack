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
import { EtablissementService } from './etablissement.service';
import { EtablissementDTO } from './etablissementDTO';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/Etablissement')
@UseInterceptors(CacheInterceptor)
export class EtablissementController {
  constructor(private EtablissementService: EtablissementService) {}

  @Post('/')
  async addEtablissement(@Body() etablissementDto: EtablissementDTO) {
    const appliaction = await this.EtablissementService.addEtablissement(
      etablissementDto,
    );
    return appliaction;
  }

  @Put('/:id')
  async updateEtablissement(
    @Body() etablissementDto: EtablissementDTO,
    @Param('id') id: string,
  ) {
    const appliaction = await this.EtablissementService.updateEtablissement(
      etablissementDto,
      id,
    );
    return appliaction;
  }

  @Get('/')
  async getEtablissement() {
    const appliaction = await this.EtablissementService.findEtablissement();
    return appliaction;
  }
}
