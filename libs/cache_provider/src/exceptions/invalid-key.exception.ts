import { CacheException } from './cache.exception';

export class InvalidKeyException extends CacheException {
  public static readonly ERROR_CODE = 'INVALID_CACHE_KEY';

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, 400);
  }
}
