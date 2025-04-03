import { CacheInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Recompensesechema } from './recompense.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RecompenseService } from './recompense.service';
import { RecompenseController } from './recompense.controller';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: 'Recompense',
        schema: Recompensesechema,
      },
    ]),
  ],
  providers: [
    RecompenseService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [RecompenseController],
  exports: [RecompenseService],
})
export class RecompenseModule {}
