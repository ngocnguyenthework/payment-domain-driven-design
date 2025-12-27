/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@/core/config/app.config';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(compression());

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Payment API')
    .setDescription('Payment processing API using DDD patterns')
    .setVersion('1.0')
    .addTag('payments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.port, () => {
    console.log('Server running on port:::  ', configService.port);
    console.log('Swagger docs at:        /api/docs');
  });
}

void bootstrap();
