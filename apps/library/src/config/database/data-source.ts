import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

import { UppercaseSnakeNamingStrategy } from './naming-strategy.config';

config({ path: './apps/merchant/.env' });

const databasePort = process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 3306;

export const databaseConfig: DataSourceOptions = {
    migrationsTableName: 'MIGRATIONS',
    namingStrategy: new UppercaseSnakeNamingStrategy(),
    type: process.env.DATABASE_TYPE as any,
    host: process.env.DATABASE_HOST,
    port: databasePort,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    migrations: [
        path.join(
            __dirname,
            '../../**/infrastructure/persistence/migrations/*{.ts,.js}',
        ),
    ],
    entities: [
        path.join(
            __dirname,
            '../../**/infrastructure/persistence/entities/*{.ts,.js}',
        ),
    ],
    synchronize: false,
    logging: true,
    timezone: 'Z',
};

export const AppDataSource = new DataSource(databaseConfig);
