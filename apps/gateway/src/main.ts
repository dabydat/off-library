import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { GlobalExceptionFilter } from '@app/common-core/infrastructure/filters/global-exception.filter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(GatewayModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors();

  const port: number | undefined = configService.get<number | undefined>('api.port');
  const serverUrl: string | undefined = configService.get<string | undefined>('api.server');
  const production: string | undefined = configService.get<string | undefined>('environment');

  const config = new DocumentBuilder()
    .setTitle('Off Library API')
    .setDescription(
      'An API that is part of a Backend for Frontend (BFF) designed for web applications, tailoring responses and simplifying communication between the frontend and microservices..',
    )
    .setVersion('1.0.0')
    .setExternalDoc('Off Library API Documentation', '/swagger-spec.json')
    .addBearerAuth()
    .addServer(serverUrl as string)
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('../swagger-spec.json', JSON.stringify(document));

  if (production !== 'production') SwaggerModule.setup(`swagger`, app, document);

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
  );

  await app.listen(port as number);

  const logger: Logger = new Logger();
  logger.log(`Running in ${port}`);
}
bootstrap();
