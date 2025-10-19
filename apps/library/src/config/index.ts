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
    // database: {
    //   type: value.DATABASE_TYPE as DatabaseType,
    //   host: value.DATABASE_HOST,
    //   port: +value.DATABASE_PORT,
    //   username: value.DATABASE_USERNAME,
    //   password: value.DATABASE_PASSWORD,
    //   database: value.DATABASE_NAME,
    // }
  };
};