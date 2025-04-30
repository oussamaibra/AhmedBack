import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { StockDTO } from './stockDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';

@Controller('stock')
export class StockController {
  constructor(
    private readonly stockService: StockService,
    private readonly excelService: ExcelService,
  ) {}

  @Post('/')
  create(@Body() createStockDto: StockDTO) {
    return this.stockService.create(createStockDto);
  }

  @Post('/extract')
  @UseInterceptors(FileInterceptor('file')) // default is in-memory buffer
  async handleExcelUpload(@UploadedFile() file: Express.Multer.File) {
    const data = this.excelService.extractAllData(file.buffer);
    // this.stockService.createMany(data);
    return data;
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
