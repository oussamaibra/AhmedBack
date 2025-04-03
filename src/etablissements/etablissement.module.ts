import { CacheInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EtablissementController } from './etablissement.controller';
import { EtablissementSchema } from './etablissement.schema';
import { EtablissementService } from './etablissement.service';
import { UserModule } from '../user/user.module';
import { SocketModule } from 'src/socketIO/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: 'Etablissements',
        schema: EtablissementSchema,
      },
    ]),
  ],
  providers: [
    EtablissementService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [EtablissementController],
  exports: [EtablissementService],
})
export class EtablissementModule {}
