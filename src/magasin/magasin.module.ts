import { CacheInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';
import { SocketModule } from 'src/socketIO/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MagasinController } from './magasin.controller';
import { MagasinSchema } from './magasin.schema';
import { MagasinService } from './magasin.service';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: 'Magasin',
        schema: MagasinSchema,
      },
    ]),
  ],
  providers: [
    MagasinService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [MagasinController],
  exports: [MagasinService],
})
export class MagasinModule {}
