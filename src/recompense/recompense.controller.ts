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
import { RecompenseService } from './recompense.service';
import { RecompenseDTO } from './recompenseDTO';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/Recompense')
@UseInterceptors(CacheInterceptor)
export class RecompenseController {
  constructor(private RecompenseService: RecompenseService) {}

  @Post('/')
  async addRecompense(@Body() etablissementDto: RecompenseDTO) {
    const appliaction = await this.RecompenseService.addRecompense(
      etablissementDto,
    );
    return appliaction;
  }

  @Get('/')
  async getRecompense() {
    const appliaction = await this.RecompenseService.findRecompense();
    return appliaction;
  }
}
