import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './logger/logging.service';
import yaml from 'yamljs';
import fs from 'node:fs';
import { error } from 'node:console';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useLogger(app.get(LoggingService));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Home Library')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const yamlString = yaml.stringify(document);
  fs.writeFileSync('doc/api.yml', yamlString);

  SwaggerModule.setup('doc/api', app, document);

  await app.listen(PORT);
}
bootstrap();
