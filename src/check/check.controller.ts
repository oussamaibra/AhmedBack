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
import { CheckService } from './check.service';
import { CheckDTO } from './checkDTO';

@Controller('checks')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Post()
  create(@Body() createCheckDto: CheckDTO) {
    return this.checkService.create(createCheckDto);
  }

  @Get()
  findAll() {
    return this.checkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkService.findOne(id);
  }

  @Get('by-num/:numCheck')
  findByNumCheck(@Param('numCheck') numCheck: string) {
    return this.checkService.findByNumCheck(numCheck);
  }

  @Get('by-status/:status')
  findByStatus(@Param('status') status: string) {
    return this.checkService.findByStatus(status);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCheckDto: CheckDTO) {
    return this.checkService.update(id, updateCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkService.remove(id);
  }
}
