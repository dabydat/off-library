import * as Joi from 'joi';
import { ConfigSchema } from './config.type';

export const configValidation = Joi.object<ConfigSchema>({
  NODE_ENV: Joi.string().valid('development', 'production', 'qa').required(),
  PORT: Joi.number().required(),
  SERVER_URL: Joi.string().required(),

  LIBRARY_HOST: Joi.string().required(),
  LIBRARY_PORT: Joi.number().required(),

  RATE_LIMIT_TTL: Joi.number().required(),
  RATE_LIMIT_LIMIT: Joi.number().required(),
});
