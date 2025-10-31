import { ArgumentsHost, Catch, ExceptionFilter, Injectable } from '@nestjs/common';
import type { Response, Request } from 'express';
import { SimpleExceptionHandler } from './services/simple-exception-handler';
import { ErrorResponseType } from './filter-types/error-response.type';
import { LoggingProviderService } from '@app/logging_provider/services/logging-provider.service';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly handler: SimpleExceptionHandler;

    constructor(
        private readonly logger: LoggingProviderService
    ) {
        this.handler = new SimpleExceptionHandler();
    }

    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const payload = this.extractPayload(exception);

        const errorResponse: ErrorResponseType = {
            status: 'error',
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            details: payload.details,
            meta: {
                exceptionType: payload.meta?.exceptionType || this.getExceptionType(exception),
                exceptionName: payload.meta?.exceptionName || exception?.exceptionName || exception?.name,
                handler: this.handler.detectHandler(exception),
            },
        };

        this.logError(exception, request, payload.status);

        response.status(payload.status).json(errorResponse);
    }

    private extractPayload(exception: any): any {
        // Si viene del microservicio con error.status y error.details
        if (exception?.error?.status && Array.isArray(exception?.error?.details)) {
            return {
                status: exception.error.status,
                details: exception.error.details,
                meta: exception.error.meta,
            };
        }

        // Caso contrario, extraer localmente
        return this.handler.process(exception);
    }

    private getExceptionType(exception: any): string {
        if (exception?.constructor?.name) {
            return exception.constructor.name;
        }

        if (exception?.error?.constructor?.name) {
            return exception.error.constructor.name;
        }

        return 'Unknown';
    }

    private logError(exception: any, request: Request, httpStatus: number): void {
        const logContext = {
            path: request.url,
            method: request.method,
            statusCode: httpStatus,
        };

        if (httpStatus >= 500) {
            this.logger.error(
                `${request.method} ${request.url} - ${httpStatus}`,
                exception?.stack || JSON.stringify(exception),
            );
        } else if (httpStatus >= 400) {
            this.logger.warn(
                `${request.method} ${request.url} - ${httpStatus}`,
                JSON.stringify(logContext),
            );
        }
    }
}