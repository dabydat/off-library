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

            const result = await action();

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
            // Mapear error nativo a excepción personalizada
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
        this.logger.error(`Mapping cache error for operation: ${operation}`, {
            key,
            errorCode: error.code,
            errorMessage: error.message,
            errorStack: error.stack
        });

        // Errores de conexión
        if (['ECONNREFUSED', 'ENOTFOUND', 'ECONNRESET', 'ECONNABORTED'].includes(error.code)) {
            const connectionError = new ConnectionErrorException(
                `Connection error during ${operation}: ${error.message}`,
                ConnectionErrorException.ERROR_CODE,
                [`Operation: ${operation}`, `Key: ${key || 'N/A'}`, `Error Code: ${error.code}`]
            );
            this.logger.error('Connection error detected', { operation, key, errorCode: error.code });
            throw connectionError;
        }

        // Errores de timeout
        if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
            const timeoutError = new OperationFailedException(
                `Timeout during ${operation}: ${error.message}`,
                OperationFailedException.ERROR_CODE,
                [`Operation: ${operation}`, `Key: ${key || 'N/A'}`, `Timeout Error`]
            );
            this.logger.error('Timeout error detected', { operation, key });
            throw timeoutError;
        }

        // Key no encontrada en GET (específico de Memcached)
        if (operation === 'get' && (!error || error.message?.includes('not found'))) {
            const notFoundError = new KeyNotFoundException(
                `Key not found: ${key}`,
                KeyNotFoundException.ERROR_CODE,
                [`Operation: ${operation}`, `Key: ${key || 'N/A'}`]
            );
            this.logger.warn('Key not found', { operation, key });
            throw notFoundError;
        }

        // Errores específicos de Memcached
        if (error.message?.includes('SERVER_ERROR') || error.message?.includes('CLIENT_ERROR')) {
            const serverError = new OperationFailedException(
                `Memcached server error during ${operation}: ${error.message}`,
                OperationFailedException.ERROR_CODE,
                [`Operation: ${operation}`, `Key: ${key || 'N/A'}`, `Server Error`]
            );
            this.logger.error('Memcached server error detected', { operation, key, error: error.message });
            throw serverError;
        }

        // Error general - todos los demás errores
        const operationError = new OperationFailedException(
            `Failed ${operation}: ${error.message || 'Unknown error'}`,
            OperationFailedException.ERROR_CODE,
            [`Operation: ${operation}`, `Key: ${key || 'N/A'}`, `Error: ${error.message || 'Unknown'}`]
        );
        this.logger.error('General operation failure', { operation, key, error: error.message || 'Unknown' });
        throw operationError;
    }
}