import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { StockDTO } from './stockDTO';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('/')
  create(@Body() createStockDto: StockDTO) {
    return this.stockService.create(createStockDto);
  }

  @Get('/')
  findAll() {
    return this.stockService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateStockDto: StockDTO) {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }

  // Custom endpoints
  @Get('/magasin/:magasinId')
  findByMagasin(@Param('magasinId') magasinId: string) {
    return this.stockService.findByMagasin(magasinId);
  }

  @Get('/taille/:taille')
  findByTaille(@Param('taille') taille: number) {
    return this.stockService.findByTaille(taille);
  }
}
