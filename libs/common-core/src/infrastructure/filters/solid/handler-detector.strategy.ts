import { DomainException } from '@app/common-core/domain/exceptions/domain.exception';
import { ValueObjectException } from '@app/common-core/domain/exceptions/value-object.exception';
import { HttpException } from '@nestjs/common';

/**
 * Strategy for detecting which handler processed an exception.
 */
export interface HandlerDetectorStrategy {
    canDetect(exception: any): boolean;
    getHandlerName(exception: any): string;
}

/**
 * Detects exceptions coming from RPC microservices.
 */
export class RpcHandlerDetector implements HandlerDetectorStrategy {
    canDetect(exception: any): boolean {
        return !!exception?.error;
    }

    getHandlerName(): string {
        return 'RpcGlobalExceptionFilter';
    }
}

/**
 * Detects ValueObject exceptions.
 */
export class ValueObjectHandlerDetector implements HandlerDetectorStrategy {
    canDetect(exception: any): boolean {
        return exception instanceof ValueObjectException;
    }

    getHandlerName(): string {
        return 'ValueObjectExceptionMapper';
    }
}

/**
 * Detects Domain exceptions.
 */
export class DomainHandlerDetector implements HandlerDetectorStrategy {
    canDetect(exception: any): boolean {
        return exception instanceof DomainException;
    }

    getHandlerName(): string {
        return 'DomainExceptionMapper';
    }
}

/**
 * Detects HTTP exceptions from NestJS.
 */
export class HttpHandlerDetector implements HandlerDetectorStrategy {
    canDetect(exception: any): boolean {
        return exception instanceof HttpException;
    }

    getHandlerName(): string {
        return 'HttpExceptionMapper';
    }
}

/**
 * Default fallback detector.
 */
export class DefaultHandlerDetector implements HandlerDetectorStrategy {
    canDetect(): boolean {
        return true; // Always matches as fallback
    }

    getHandlerName(): string {
        return 'DefaultExceptionMapper';
    }
}

// For future purposes
// export class GraphQLHandlerDetector implements HandlerDetectorStrategy {
//     canDetect(exception: any): boolean {
//         return exception instanceof GraphQLException;
//     }

//     getHandlerName(): string {
//         return 'GraphQLExceptionMapper';
//     }
// }