import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { configValidation } from './config/config-validation';
import { BookModule } from './book/book.module';
import { DatabaseModule } from './config/database/database.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { TransformableInfo } from 'logform';
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
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              ({
                timestamp,
                level,
                message,
                ...meta
              }: TransformableInfo): string => {
                return JSON.stringify({
                  timestamp,
                  level,
                  message,
                  ...meta,
                });
              },
            ),
          ),
        }),
      ],
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
