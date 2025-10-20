import { DatabaseType, DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

import { UppercaseSnakeNamingStrategy } from './naming-strategy.config';

config({ path: './apps/library/.env' });

const dataDir = process.env.DATABASE_PATH || path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const databaseConfig: DataSourceOptions = {
    migrationsTableName: 'MIGRATIONS',
    namingStrategy: new UppercaseSnakeNamingStrategy(),
    type: process.env.DATABASE_TYPE as any,
    database: path.join(dataDir, process.env.DATABASE_NAME || 'off_library.db'),
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
    logging: process.env.DATABASE_LOG_QUERIES === 'true'
};

export const AppDataSource = new DataSource(databaseConfig);
