import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(loggerService);
  app.enableVersioning({ type: VersioningType.URI });
  app.enableShutdownHooks();

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Playground')
    .setDescription('https://github.com/sh0e1/nestjs-playground')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('port');
  loggerService.log(`Listing on port ${port}`);
  await app.listen(port);
}

bootstrap();
