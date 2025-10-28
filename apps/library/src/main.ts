import { NestFactory } from '@nestjs/core';
import { LibraryModule } from './library.module';
import { INestApplication, INestMicroservice, Logger, NestHybridApplicationOptions, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { RpcGlobalExceptionFilter } from '@app/common-core/infrastructure/filters/rpc-exception.filter';

async function bootstrap() {
  const app: INestApplication<any> = await NestFactory.create(LibraryModule);
  const configService = app.get(ConfigService);

  const host: string | undefined = configService.get<string | undefined>('api.host');
  const port: number | undefined = configService.get<number | undefined>('api.port');

  const microservice: INestMicroservice = app.connectMicroservice(
    { transport: Transport.TCP, options: { host, port } } as ClientOptions,
    { inheritAppConfig: true } as NestHybridApplicationOptions,
  );

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, })
  );

  await app.init();
  await microservice.listen();

  const logger: Logger = new Logger();
  logger.log(`Running in ${port}`);
}
bootstrap();
