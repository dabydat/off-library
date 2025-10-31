import { Inject, Injectable } from '@nestjs/common';
import { LOGGING_PROVIDER_TOKEN, type LoggingProviderPort } from '../../../logging_provider/src';
import { CacheException, ConnectionErrorException, InvalidKeyCharactersException, InvalidKeyException, KeyNotFoundException, KeyTooLongException, OperationFailedException } from '../exceptions';

@Injectable()
export class CacheOperationWrapper {
    private readonly MAX_KEY_LENGTH = 250;

    constructor(@Inject(LOGGING_PROVIDER_TOKEN) private readonly logger: LoggingProviderPort) { }

    public async execute<T>(operation: string, key: string | undefined, action: () => Promise<T>): Promise<T> {
        try {
            this.logger.debug(`Executing cache operation: ${operation}`, { key });

            // Validar key si es necesaria para la operación
            if (operation !== 'flush' && key) {
                this.validateKey(key);
            }

            const result = await action().catch(err => this.mapError(err, operation, key));

            this.logger.debug(`Cache operation completed successfully: ${operation}`, { key });
            return result;
        } catch (error) {
            if (error instanceof CacheException) {
                this.logger.error(`Cache operation failed: ${operation}`, {
                    key,
                    error: error.message,
                    errorCode: error.errorCode
                });
                throw error;
            }
            this.mapError(error, operation, key);
        }
    }

    private validateKey(key: string): void {
        if (!key || typeof key !== 'string' || key.length === 0) {
            this.logger.warn('Invalid key validation failed', { key, reason: 'empty or invalid type' });
            throw new InvalidKeyException(`Invalid key: ${key}`, InvalidKeyException.ERROR_CODE, [`Key: ${key}`]);
        }
        if (key.length > this.MAX_KEY_LENGTH) {
            this.logger.warn('Key length validation failed', { key, length: key.length, maxLength: this.MAX_KEY_LENGTH });
            throw new KeyTooLongException(`Key too long: ${key}`, KeyTooLongException.ERROR_CODE, [`Length: ${key.length}`]);
        }
        if (/[\x00-\x20]/.test(key)) {
            this.logger.warn('Key character validation failed', { key, reason: 'contains invalid characters' });
            throw new InvalidKeyCharactersException(`Invalid chars: ${key}`, InvalidKeyCharactersException.ERROR_CODE, [`Key: ${key}`]);
        }
    }

    private mapError(error: any, operation: string, key?: string): never {
        this.logger.warn(`Mapping cache error for operation: ${operation}`, {
            key,
            errorCode: error.code,
            errorMessage: error.message
        });

        if (['ECONNREFUSED', 'ENOTFOUND', 'ECONNRESET'].includes(error.code)) {
            const connectionError = new ConnectionErrorException(`Connection error: ${error.code}`, ConnectionErrorException.ERROR_CODE, [`Operation: ${operation}`, `Key: ${key || 'N/A'}`]);
            this.logger.error('Connection error detected', { operation, key, errorCode: error.code });
            throw connectionError;
        }
        // Timeout
        if (error.code === 'ETIMEDOUT') {
            const timeoutError = new OperationFailedException(`Timeout: ${operation}`, OperationFailedException.ERROR_CODE, [`Key: ${key || 'N/A'}`]);
            this.logger.error('Timeout error detected', { operation, key });
            throw timeoutError;
        }
        // Key no encontrada en GET
        if (operation === 'get' && (error.message?.includes('not found') || !error)) {
            const notFoundError = new KeyNotFoundException(`Key not found: ${key}`, KeyNotFoundException.ERROR_CODE, [`Key: ${key || 'N/A'}`]);
            this.logger.warn('Key not found', { operation, key });
            throw notFoundError;
        }

        const operationError = new OperationFailedException(`Failed ${operation}`, OperationFailedException.ERROR_CODE, [`Key: ${key || 'N/A'}`, `Error: ${error.message || 'Unknown'}`]);
        this.logger.error('General operation failure', { operation, key, error: error.message || 'Unknown' });
        throw operationError;
    }
}