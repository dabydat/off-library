import { CacheException } from './cache.exception';

export class KeyNotFoundException extends CacheException {
  public static readonly ERROR_CODE = 'KEY_NOT_FOUND';

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, 404);
  }
}
