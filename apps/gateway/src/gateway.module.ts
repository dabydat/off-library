import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configEnvironment from './config';
import { configValidation } from './config/config-validation';
import { LibraryMsModule } from './library-ms/library-ms.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '@app/common-core/infrastructure/filters/global-exception.filter';
import { LoggingProviderModule } from '@app/logging_provider';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configEnvironment],
      envFilePath: `apps/gateway/.env`,
      validationSchema: configValidation,
    }),
    LoggingProviderModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        level: configService.get('LOG_LEVEL', 'info'),
        transports: [
          new winston.transports.Console(),
          ...(configService.get('NODE_ENV') === 'production' ? [
            new winston.transports.File({
              filename: 'logs/library-app.log',
              format: winston.format.json()
            })
          ] : [])
        ]
      })
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
