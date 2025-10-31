export type DatabaseType =
  | 'mysql'
  | 'mariadb'
  | 'postgres'
  | 'cockroachdb'
  | 'sqlite'
  | 'mssql'
  | 'sap'
  | 'oracle'
  | 'cordova'
  | 'nativescript'
  | 'react-native'
  | 'mongodb'
  | 'aurora-mysql'
  | 'aurora-postgres'
  | 'expo'
  | 'better-sqlite3'
  | 'capacitor'
  | 'spanner';

export const databaseTypes: DatabaseType[] = [
  'mysql',
  'mariadb',
  'postgres',
  'cockroachdb',
  'sqlite',
  'mssql',
  'sap',
  'oracle',
  'cordova',
  'nativescript',
  'react-native',
  'mongodb',
  'aurora-mysql',
  'aurora-postgres',
  'expo',
  'better-sqlite3',
  'capacitor',
  'spanner',
];

export type NodeEnvType = 'development' | 'production' | 'qa';

export const nodeEnvTypes: NodeEnvType[] = ['development', 'production', 'qa'];

export type DatabaseConfig = {
  type: DatabaseType;
  database: string;
  logQueries: boolean;
  synchronize: boolean;
  encryptionKey: string;
};

export type ConfigSchema = {
  NODE_ENV: string;
  PORT: string;
  HOST: string;
  // database
  DATABASE_TYPE: string;
  DATABASE_NAME: string;
  DATABASE_LOG_QUERIES: boolean;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_ENCRYPTION_KEY: string;
  // kafka
  KAFKA_BROKER: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_MAX_TRIES: number;
  KAFKA_RETRY_DELAY_MS: number;
  // factus
  FACTUS_URL_API: string;
  FACTUS_USERNAME: string;
  FACTUS_PASSWORD: string;
  FACTUS_CLIENT_ID: string;
  FACTUS_CLIENT_SECRET: string;
  // cache
  CACHE_HOST: string;
  CACHE_PORT: number;
};

export type ConfigEnvironment = {
  api: {
    port: number;
    host: string;
  };
  database: DatabaseConfig;
  environment: NodeEnvType;
  kafka: {
    broker: string;
    clientId: string;
    maxTries: number;
    retryDelayMs: number;
  };
  factus: {
    urlApi: string;
    username: string;
    password: string;
    clientId: string;
    clientSecret: string;
  },
  cache: {
    host: string;
    port: number;
  }
};
