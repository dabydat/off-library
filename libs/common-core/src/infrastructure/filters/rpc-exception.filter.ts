import { ExceptionFilter, Catch, Logger, Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { SimpleExceptionHandler } from './services/simple-exception-handler';
import { LOGGING_PROVIDER_TOKEN, type LoggingProviderPort } from '@app/logging_provider';

@Catch()
@Injectable()
export class RpcGlobalExceptionFilter implements ExceptionFilter {
    private readonly handler: SimpleExceptionHandler;

    constructor(
        @Inject(LOGGING_PROVIDER_TOKEN)
        private readonly logger: LoggingProviderPort
    ) {
        this.handler = new SimpleExceptionHandler();
    }

    catch(exception: any): Observable<never> {
        this.logException(exception);

        // Si ya es RpcException formateada correctamente
        if (this.isFormattedRpcException(exception)) {
            return throwError(() => exception);
        }

        // Extraer y construir payload estructurado
        const payload = this.handler.process(exception);
        this.logger.debug('RPC Payload:', JSON.stringify(payload));

        return throwError(() => new RpcException(payload));
    }

    private isFormattedRpcException(exception: any): boolean {
        if (!(exception instanceof RpcException)) {
            return false;
        }

        const error = exception.getError();
        return (
            typeof error === 'object' &&
            error !== null &&
            'status' in error &&
            'details' in error
        );
    }

    private logException(exception: any): void {
        this.logger.debug('Exception caught:', {
            name: exception?.name || exception?.constructor?.name,
            message: exception?.message,
            exceptionName: exception?.exceptionName,
        });
    }
}