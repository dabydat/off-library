import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { DomainException } from '@app/common-core/domain/exceptions/domain.exception';
import { ValueObjectException } from '@app/common-core/domain/exceptions/value-object.exception';
import { ErrorPayload } from '../filter-types/error-response.type';

// Reglas de mapeo consolidadas
const EXCEPTION_RULES = [
    { patterns: ['AlreadyExists', 'Duplicate', 'Exists'], status: HttpStatus.CONFLICT },
    { patterns: ['NotFound', 'Missing', 'DoesNotExist'], status: HttpStatus.NOT_FOUND },
    { patterns: ['Unauthorized', 'Unauthenticated'], status: HttpStatus.UNAUTHORIZED },
    { patterns: ['Forbidden', 'AccessDenied', 'PermissionDenied'], status: HttpStatus.FORBIDDEN },
    { patterns: ['Invalid', 'Malformed', 'Bad'], status: HttpStatus.BAD_REQUEST },
];

@Injectable()
export class SimpleExceptionHandler {

    process(exception: any): ErrorPayload {
        const name = this.extractName(exception);
        const message = this.extractMessage(exception);
        const type = this.extractType(exception);

        return {
            status: this.mapToStatus(name, exception),
            details: [{
                message,
                code: this.mapToCode(name),
                param: exception.details || exception.param,
            }],
            meta: {
                exceptionType: type,
                exceptionName: name,
            }
        };
    }

    detectHandler(exception: any): string {
        if (exception?.error) return 'RpcGlobalExceptionFilter';
        if (exception instanceof ValueObjectException) return 'ValueObjectExceptionMapper';
        if (exception instanceof DomainException) return 'DomainExceptionMapper';
        if (exception instanceof HttpException) return 'HttpExceptionMapper';
        return 'DefaultExceptionMapper';
    }

    private extractName(exception: any): string {
        return exception?.exceptionName ||
            exception?.name ||
            exception?.error?.exceptionName ||
            exception?.error?.name ||
            this.getFromRpc(exception, 'exceptionName') ||
            this.getFromRpc(exception, 'name') ||
            (exception?.constructor?.name !== 'Object' ? exception?.constructor?.name : null) ||
            'UnknownException';
    }

    private extractMessage(exception: any): string {
        const rawMessage = exception?.error?.message ||
            this.getFromRpc(exception, 'message') ||
            exception?.message ||
            this.getFromResponse(exception) ||
            (typeof exception === 'string' ? exception : null) ||
            'Internal server error';

        return this.sanitizeMessage(rawMessage);
    }

    private extractType(exception: any): string {
        if (exception instanceof ValueObjectException) return 'ValueObjectException';
        if (exception instanceof DomainException) return 'DomainException';
        if (exception instanceof HttpException) return 'HttpException';
        if (exception?.constructor?.name && exception.constructor.name !== 'Object') {
            return exception.constructor.name;
        }
        return 'UnknownException';
    }

    private mapToStatus(name: string, exception: any): number {
        // Si es HttpException, usar su status
        if (exception instanceof HttpException) {
            return exception.getStatus();
        }

        // Buscar en reglas por nombre
        for (const rule of EXCEPTION_RULES) {
            if (rule.patterns.some(pattern => name.includes(pattern))) {
                return rule.status;
            }
        }

        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private mapToCode(name: string): string {
        return name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
    }

    private getFromRpc(exception: any, property: string): any {
        if (typeof exception?.getError === 'function') {
            const error = exception.getError();
            return error?.[property];
        }
        return null;
    }

    private getFromResponse(exception: any): string | null {
        const response = exception?.getResponse?.();
        if (typeof response === 'string') return response;
        if (response?.message) return String(response.message);
        return null;
    }

    sanitizeMessage(message: string): string {
        const dangerousPatterns = [
            'There is no matching message handler defined in the remote service.',
            'Connection refused',
            'ECONNREFUSED',
            'ENOTFOUND',
            'getaddrinfo',
        ];

        for (const pattern of dangerousPatterns) {
            if (message.includes(pattern)) {
                return 'Service temporarily unavailable';
            }
        }

        return message.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
    }
}