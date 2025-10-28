import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configEnvironment from './config';
import { configValidation } from './config/config-validation';
import { LibraryMsModule } from './library-ms/library-ms.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '@app/common-core/infrastructure/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configEnvironment],
      envFilePath: `apps/gateway/.env`,
      validationSchema: configValidation,
    }),
    LibraryMsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class GatewayModule { }
