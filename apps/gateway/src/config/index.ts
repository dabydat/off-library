import { configValidation } from './config-validation';
import { ConfigEnvironment, NodeEnvType } from './config.type';

export default (): ConfigEnvironment => {
  const { value, error } = configValidation.validate(process.env, { abortEarly: false, stripUnknown: true });
  if (error) throw new Error(`Config validation error: ${error.message}`);
  return {
    api: {
      port: +value.PORT,
      server: value.SERVER_URL,
    },
    environment: value.NODE_ENV as NodeEnvType,
    client: {
      library: {
        host: value.LIBRARY_HOST,
        port: value.LIBRARY_PORT,
      },
    },
    rate_limit: {
      ttl: +value.RATE_LIMIT_TTL,
      limit: +value.RATE_LIMIT_LIMIT,
    }
  };
};