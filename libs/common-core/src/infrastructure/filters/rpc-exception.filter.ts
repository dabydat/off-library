import { ExceptionFilter, Catch, Logger, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { ExceptionExtractorService } from './solid/exception-extractor.service';

@Catch()
@Injectable()
export class RpcGlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(RpcGlobalExceptionFilter.name);
    private readonly extractor: ExceptionExtractorService;

    constructor() {
        this.extractor = new ExceptionExtractorService();
    }

    catch(exception: any): Observable<never> {
        this.logException(exception);

        // Si ya es RpcException formateada correctamente
        if (this.isFormattedRpcException(exception)) {
            return throwError(() => exception);
        }

        // Extraer y construir payload estructurado
        const payload = this.extractor.extract(exception);

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