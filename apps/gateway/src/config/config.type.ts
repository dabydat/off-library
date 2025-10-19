export type NodeEnvType = 'development' | 'production' | 'qa';

export const nodeEnvTypes: NodeEnvType[] = ['development', 'production', 'qa'];

export type ConfigSchema = {
  NODE_ENV: string;
  PORT: string;
  SERVER_URL: string;
  LIBRARY_HOST: string;
  LIBRARY_PORT: number;
  RATE_LIMIT_TTL: number;
  RATE_LIMIT_LIMIT: number;
};

export type ConfigEnvironment = {
  api: {
    port: number;
    server: string;
  };
  environment: NodeEnvType;
  client: {
    library: {
      host: string;
      port: number;
    };
  };
  rate_limit: {
    ttl: number;
    limit: number;
  };
};
