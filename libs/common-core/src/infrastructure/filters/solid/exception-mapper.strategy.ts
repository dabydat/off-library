import { HttpStatus } from '@nestjs/common';
import { EXCEPTION_MAPPING_RULES } from './exception-mapping.rules';

export interface ExceptionMapperStrategy {
    canHandle(exception: any): boolean;
    mapToStatus(exception: any): number;
    mapToCode(exception: any): string;
}

export class DomainExceptionMapper implements ExceptionMapperStrategy {
    canHandle(exception: any): boolean {
        return exception?.constructor?.name === 'DomainException' ||
            exception?.exceptionName?.endsWith('Exception');
    }

    mapToStatus(exception: any): number {
        const exceptionName = exception.exceptionName || exception.name;

        // ✅ Buscar en las reglas configurables
        const matchedRule = this.findMatchingRule(exceptionName);

        if (matchedRule) {
            return matchedRule.status;
        }

        // Default para DomainException
        return HttpStatus.BAD_REQUEST;
    }

    mapToCode(exception: any): string {
        return this.toSnakeCase(exception.exceptionName || exception.name);
    }

    // ========== Método de búsqueda por reglas ==========

    private findMatchingRule(exceptionName: string) {
        // Ordenar por prioridad descendente
        const sortedRules = [...EXCEPTION_MAPPING_RULES].sort(
            (a, b) => (b.priority || 0) - (a.priority || 0)
        );

        for (const rule of sortedRules) {
            for (const pattern of rule.patterns) {
                if (exceptionName.includes(pattern)) {
                    return rule;
                }
            }
        }

        return null;
    }

    private toSnakeCase(value: string): string {
        return value
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toUpperCase();
    }
}

export class ValueObjectExceptionMapper implements ExceptionMapperStrategy {
    canHandle(exception: any): boolean {
        return exception?.constructor?.name === 'ValueObjectException';
    }

    mapToStatus(): number {
        return HttpStatus.BAD_REQUEST;
    }

    mapToCode(exception: any): string {
        return exception.exceptionName?.toUpperCase().replace(/\s+/g, '_') || 'VALIDATION_ERROR';
    }
}

export class HttpExceptionMapper implements ExceptionMapperStrategy {
    private readonly statusCodeMap: Record<number, string> = {
        [HttpStatus.BAD_REQUEST]: 'INVALID_ARGUMENT',
        [HttpStatus.UNAUTHORIZED]: 'UNAUTHENTICATED',
        [HttpStatus.FORBIDDEN]: 'PERMISSION_DENIED',
        [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
        [HttpStatus.CONFLICT]: 'ALREADY_EXISTS',
        [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
        [HttpStatus.TOO_MANY_REQUESTS]: 'RESOURCE_EXHAUSTED',
        [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
        [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
    };

    canHandle(exception: any): boolean {
        return exception?.constructor?.name === 'HttpException' ||
            typeof exception?.getStatus === 'function';
    }

    mapToStatus(exception: any): number {
        return exception.getStatus();
    }

    mapToCode(exception: any): string {
        const status = exception.getStatus();
        return this.statusCodeMap[status] ||
            (status >= 400 && status < 500 ? 'CLIENT_ERROR' : 'INTERNAL_ERROR');
    }
}

export class DefaultExceptionMapper implements ExceptionMapperStrategy {
    canHandle(): boolean {
        return true; // Fallback siempre puede manejar
    }

    mapToStatus(): number {
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    mapToCode(): string {
        return 'INTERNAL_ERROR';
    }
}