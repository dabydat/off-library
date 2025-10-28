import { ArgumentsHost, Catch, ExceptionFilter, Logger, Injectable } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ExceptionExtractorService } from './solid/exception-extractor.service';
import { ErrorResponseType } from './filter-types/error-response.type';
import { HandlerDetectorService } from './solid/handler-dectector.service';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);
    private readonly extractor: ExceptionExtractorService;
    private readonly handlerDetector: HandlerDetectorService;

    constructor() {
        this.extractor = new ExceptionExtractorService();
        this.handlerDetector = new HandlerDetectorService();
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
                handler: this.handlerDetector.detect(exception),
            },
        };

        this.logError(exception, request, payload.status);

        response.status(payload.status).json(errorResponse);
    }

    private extractPayload(exception: any): any {
        if (exception?.error?.status && Array.isArray(exception?.error?.details)) {
            return {
                status: exception.error.status,
                details: exception.error.details,
                meta: exception.error.meta,
            };
        }

        return this.extractor.extract(exception);
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