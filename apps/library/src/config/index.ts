import { configValidation } from './config-validation';
import { ConfigEnvironment, DatabaseType, NodeEnvType } from './config.type';

export default (): ConfigEnvironment => {
  const { value, error } = configValidation.validate(process.env, { abortEarly: false, stripUnknown: true });
  if (error) throw new Error(`Config validation error: ${error.message}`);
  return {
    api: {
      port: +value.PORT,
      host: value.HOST,
    },
    environment: value.NODE_ENV as NodeEnvType,
    database: {
      type: value.DATABASE_TYPE as DatabaseType,
      database: value.DATABASE_NAME,
      logQueries: value.DATABASE_LOG_QUERIES,
      synchronize: value.DATABASE_SYNCHRONIZE,
      encryptionKey: value.DATABASE_ENCRYPTION_KEY,
    },
    kafka: {
      broker: value.KAFKA_BROKER,
      clientId: value.KAFKA_CLIENT_ID,
      maxTries: value.KAFKA_MAX_TRIES,
      retryDelayMs: value.KAFKA_RETRY_DELAY_MS,
    }
  };
};