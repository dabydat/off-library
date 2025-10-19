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
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type ConfigSchema = {
  NODE_ENV: string;
  PORT: string;
  HOST: string;
  // DATABASE_TYPE: string;
  // DATABASE_HOST: string;
  // DATABASE_PORT: number;
  // DATABASE_USERNAME: string;
  // DATABASE_PASSWORD: string;
  // DATABASE_NAME: string;
};

export type ConfigEnvironment = {
  api: {
    port: number;
    host: string;
  };
  // database: DatabaseConfig;
  environment: NodeEnvType;
};
