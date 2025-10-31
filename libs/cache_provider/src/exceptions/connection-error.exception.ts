import { CacheException } from './cache.exception';

export class ConnectionErrorException extends CacheException {
  public static readonly ERROR_CODE = 'CONNECTION_ERROR';

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, 503);
  }
}
