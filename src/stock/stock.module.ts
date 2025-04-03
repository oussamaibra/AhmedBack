import { CacheInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';
import { SocketModule } from 'src/socketIO/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { StockSchema } from './stock.schema';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: 'Stock',
        schema: StockSchema,
      },
    ]),
  ],
  providers: [
    StockService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
