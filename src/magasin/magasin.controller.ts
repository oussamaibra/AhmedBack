import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MagasinService } from './magasin.service';
import { MagasinDTO } from './magasinDTO';

@Controller('magasins')
export class MagasinController {
  constructor(private readonly magasinService: MagasinService) {}

  @Post()
  create(@Body() createMagasinDto: MagasinDTO) {
    return this.magasinService.create(createMagasinDto);
  }

  @Get()
  findAll() {
    return this.magasinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.magasinService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMagasinDto: MagasinDTO) {
    return this.magasinService.update(id, updateMagasinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.magasinService.remove(id);
  }
}
