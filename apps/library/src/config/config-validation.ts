import * as Joi from 'joi';
import { ConfigSchema } from './config.type';

export const configValidation = Joi.object<ConfigSchema>({
  NODE_ENV: Joi.string().valid('development', 'production', 'qa').required(),
  PORT: Joi.number().required(),
  HOST: Joi.string().required(),

  DATABASE_TYPE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  KAFKA_BROKER: Joi.string().required(),
  KAFKA_CLIENT_ID: Joi.string().required(),
});
