import { CacheException } from './cache.exception';

export class InvalidKeyCharactersException extends CacheException {
    public static readonly ERROR_CODE = 'INVALID_KEY_CHARACTERS';

    constructor(message: string, errorCode: string, details: string[]) {
        super(message, errorCode, details, 400);
    }
}