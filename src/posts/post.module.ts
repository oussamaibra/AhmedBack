import { CacheInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './post.controller';
import { PostSchema } from './post.schema';
import { PostService } from './post.service';
import { UserModule } from '../user/user.module';
import { SocketModule } from 'src/socketIO/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: 'Posts',
        schema: PostSchema,
      },
    ]),
  ],
  providers: [
    PostService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
