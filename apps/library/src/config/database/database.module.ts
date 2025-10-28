import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DatabaseType } from '../config.type';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
                type: config.get('database.type') as DatabaseType,
                database: require('path').join(
                    config.get('DATABASE_PATH') || './data',
                    config.get('DATABASE_NAME') || 'off_library.db'
                ) as string,
                autoLoadEntities: true,
                logging: config.get('database.logQueries') as boolean,
                synchronize: config.get('database.synchronize') as boolean,
                timezone: 'Z',
            }),
        }),
    ],
})
export class DatabaseModule { }
