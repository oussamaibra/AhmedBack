import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Check, CheckSchema } from './check.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Check.name, schema: CheckSchema }]),
  ],
  controllers: [CheckController],
  providers: [CheckService],
  exports: [CheckService],
})
export class CheckModule {}
