import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import yaml from 'yamljs';
import fs from 'node:fs';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Home Library')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const yamlString = yaml.stringify(document);
  fs.writeFileSync('api.yml', yamlString);

  SwaggerModule.setup('doc/api', app, document);

  await app.listen(PORT);
}
bootstrap();
