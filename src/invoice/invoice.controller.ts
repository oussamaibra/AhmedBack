import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './invoiceDTO';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('')
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInv(createInvoiceDto);
  }

  @Get('')
  async findAll(
    @Query('magasinId') magasinId?: string,
    @Query('status') status?: 'paid' | 'unpaid' | 'partially_paid',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filter: any = {};
    if (magasinId) filter['items.magasinId'] = magasinId;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    return this.invoiceService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: string) {
    return this.invoiceService.findByCustomer(customerId);
  }

  @Get('magasin/:magasinId')
  async findByMagasin(@Param('magasinId') magasinId: string) {
    return this.invoiceService.findByMagasin(magasinId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() statusUpdate: CreateInvoiceDto,
  ) {
    return this.invoiceService.updateStatus(id, statusUpdate.status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }

  @Get('stats/summary')
  async getStats() {
    return this.invoiceService.getInvoiceStats();
  }
}
