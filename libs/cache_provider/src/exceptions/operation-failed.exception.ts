import { CacheException } from './cache.exception';

export class OperationFailedException extends CacheException {
  public static readonly ERROR_CODE = 'OPERATION_FAILED';

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, 500);
  }
}
