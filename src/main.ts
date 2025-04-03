import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['content-type', 'Authorization'],
    origin: '*',
    credentials: true,
  });
  // Use the compression middleware
  app.use(compression());

  await app.listen(3000);
  app.enableShutdownHooks();
}
bootstrap();
