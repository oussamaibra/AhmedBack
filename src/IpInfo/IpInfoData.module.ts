import { CacheInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IpInfoDataController } from './IpInfoData.controller';
import { IpInfoDataSchema } from './IpInfoData.schema';
import { IpInfoDataService } from './IpInfoData.service';
import { UserModule } from '../user/user.module';
import { SocketModule } from 'src/socketIO/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register(),

    SocketModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: 'IpInfoData',
        schema: IpInfoDataSchema,
      },
    ]),
  ],
  providers: [
    IpInfoDataService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [IpInfoDataController],
  exports: [IpInfoDataService],
})
export class IpInfoDataModule {}
