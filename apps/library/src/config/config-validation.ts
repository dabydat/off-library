import * as Joi from 'joi';
import { ConfigSchema } from './config.type';

export const configValidation = Joi.object<ConfigSchema>({
  NODE_ENV: Joi.string().valid('development', 'production', 'qa').required(),
  PORT: Joi.number().required(),
  HOST: Joi.string().required(),

  KAFKA_BROKER: Joi.string().required(),
  KAFKA_CLIENT_ID: Joi.string().required(),
  KAFKA_MAX_TRIES: Joi.number().required(),
  KAFKA_RETRY_DELAY_MS: Joi.number().required(),

  DATABASE_TYPE: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_LOG_QUERIES: Joi.boolean().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().required(),
  DATABASE_ENCRYPTION_KEY: Joi.string().required(),
});
