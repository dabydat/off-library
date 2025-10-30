import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from './config/swagger';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(GatewayModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors();

  const port: number | undefined = configService.get<number | undefined>('api.port');
  const serverUrl: string | undefined = configService.get<string | undefined>('api.server');
  const production: string | undefined = configService.get<string | undefined>('environment');

  const document = setupSwagger(app, serverUrl as string);
  if (production !== 'production') SwaggerModule.setup(`swagger`, app, document);

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
  );

  await app.listen(port as number);

  const logger: Logger = new Logger();
  logger.log(`Running in ${port}`);
}
bootstrap();
