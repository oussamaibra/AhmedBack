import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { ListenerOnModele } from './modele.listener';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import 'dotenv/config';
import { IpInfoDataModule } from './IpInfo/IpInfoData.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';
// import { CacheModule } from '@nestjs/cache-manager';
import { SocketModule } from './socketIO/socket.module';
import { StockModule } from './stock/stock.module';
import { EtablissementModule } from './etablissements/etablissement.module';
import { ScraperModule } from './scraper/scraper.module';
import { Magasin } from './magasin/magasin.schema';
import { MagasinModule } from './magasin/magasin.module';
import { CheckModule } from './check/check.module';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forRoot(process.env.DATA_BASE_URL),
    SocketModule,
    UserModule,
    AuthModule,
    ScraperModule,
    StockModule,
    CheckModule,
    MagasinModule,
    EtablissementModule,
    IpInfoDataModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../..', 'E-learning'),
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ListenerOnModele,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
