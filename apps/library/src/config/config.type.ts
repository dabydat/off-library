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
  DATABASE_TYPE: string;
  DATABASE_NAME: string;
  DATABASE_LOG_QUERIES: boolean;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_ENCRYPTION_KEY: string;
  KAFKA_BROKER: string;
  KAFKA_CLIENT_ID: string;
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
  };
};
