import { ArgumentsHost, Catch, ExceptionFilter, Inject, Injectable } from '@nestjs/common';
import type { Response, Request } from 'express';
import { SimpleExceptionHandler } from './services/simple-exception-handler';
import { ErrorResponseType } from './filter-types/error-response.type';
import { LOGGING_PROVIDER_TOKEN, type LoggingProviderPort } from '@app/logging_provider';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly handler: SimpleExceptionHandler;

    constructor(
        @Inject(LOGGING_PROVIDER_TOKEN)
        private readonly logger: LoggingProviderPort
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
                exceptionType: payload.meta?.exceptionType,
                exceptionName: payload.meta?.exceptionName,
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



    private logError(exception: any, request: Request, httpStatus: number): void {
        const payload = this.extractPayload(exception);

        const logContext = {
            path: request.url,
            method: request.method,
            statusCode: httpStatus,
            exceptionType: payload.meta?.exceptionType,
            exceptionName: payload.meta?.exceptionName,
            handler: this.handler.detectHandler(exception),
            details: payload.details,
            stack: exception?.stack
        };

        if (httpStatus >= 400) {
            this.logger.error(
                `${request.method} ${request.url} - ${httpStatus}`,
                logContext
            );
        } else if (httpStatus >= 300) {
            this.logger.warn(
                `${request.method} ${request.url} - ${httpStatus}`,
                logContext
            );
        }
    }
}