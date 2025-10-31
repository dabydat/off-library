import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggingProviderModule } from '@app/logging_provider';
import * as winston from 'winston';
import config from './config';
import { configValidation } from './config/config-validation';
import { BookModule } from './book/book.module';
import { DatabaseModule } from './config/database/database.module';

import { RpcGlobalExceptionFilter } from '@app/common-core/infrastructure/filters/rpc-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: `apps/library/.env`,
      validationSchema: configValidation,
    }),
    LoggingProviderModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        level: configService.get('LOG_LEVEL', 'info'),
        transports: [
          new winston.transports.Console(), // ✅ Sin formato - viene del provider
          ...(configService.get('NODE_ENV') === 'production' ? [
            new winston.transports.File({
              filename: 'logs/library-app.log',
              format: winston.format.json() // Solo para archivos usamos JSON
            })
          ] : [])
        ]
      })
    }),
    DatabaseModule,
    BookModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RpcGlobalExceptionFilter,
    },
  ],
})
export class LibraryModule { }
