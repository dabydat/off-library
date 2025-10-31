import { CacheException } from './cache.exception';

export class KeyTooLongException extends CacheException {
    public static readonly ERROR_CODE = 'CACHE_KEY_TOO_LONG';

    constructor(message: string, errorCode: string, details: string[]) {
        super(message, errorCode, details, 400);
    }
}