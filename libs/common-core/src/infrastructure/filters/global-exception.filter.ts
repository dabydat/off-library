import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    Logger,
    Injectable,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ExceptionExtractorService } from './solid/exception-extractor.service';

interface ErrorResponse {
    status: 'error';
    timestamp: string;
    path: string;
    method: string;
    details: Array<{
        message: string;
        code: string;
        param?: string;
    }>;
    meta: {
        exceptionType: string;
        exceptionName?: string;
        handler: string;
    };
}

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);
    private readonly extractor: ExceptionExtractorService;

    constructor() {
        this.extractor = new ExceptionExtractorService();
    }

    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Extraer payload desde microservicio o excepción local
        const payload = this.extractPayload(exception);

        // Construir respuesta estandarizada
        const errorResponse: ErrorResponse = {
            status: 'error',
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            details: payload.details,
            meta: {
                // ✅ Si el payload ya tiene meta (desde RPC), úsalo
                exceptionType: payload.meta?.exceptionType || this.getExceptionType(exception),
                exceptionName: payload.meta?.exceptionName || exception?.exceptionName || exception?.name,
                handler: this.getHandlerName(exception),
            },
        };

        // Log
        this.logError(exception, request, payload.status);

        // Enviar respuesta
        response.status(payload.status).json(errorResponse);
    }

    private extractPayload(exception: any): any {
        // Si viene del microservicio con error.status y error.details
        if (exception?.error?.status && Array.isArray(exception?.error?.details)) {
            return {
                status: exception.error.status,
                details: exception.error.details,
                meta: exception.error.meta, // ✅ Extraer meta del microservicio
            };
        }

        // Caso contrario, extraer localmente
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

    private getHandlerName(exception: any): string {
        // Si viene del microservicio con metadata
        if (exception?.error?.meta) {
            return 'RpcGlobalExceptionFilter';
        }

        // Si viene del microservicio sin metadata
        if (exception?.error) {
            return 'RpcGlobalExceptionFilter';
        }

        // Si es local
        if (exception?.constructor?.name === 'HttpException') {
            return 'HttpExceptionMapper';
        }

        if (exception?.constructor?.name === 'DomainException') {
            return 'DomainExceptionMapper';
        }

        if (exception?.constructor?.name === 'ValueObjectException') {
            return 'ValueObjectExceptionMapper';
        }

        return 'DefaultExceptionMapper';
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