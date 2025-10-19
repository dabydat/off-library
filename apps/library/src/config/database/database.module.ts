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
                host: config.get('database.host') as string,
                port: config.get('database.port') as number,
                username: config.get('database.username') as string,
                password: config.get('database.password') as string,
                database: config.get('database.database') as string,
                autoLoadEntities: true,
                synchronize: false,
                logging: false,
                timezone: 'Z',
            }),
        }),
    ],
})
export class DatabaseModule { }
