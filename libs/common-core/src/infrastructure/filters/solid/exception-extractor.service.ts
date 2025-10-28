import { Injectable } from '@nestjs/common';
import { DefaultExceptionMapper, DomainExceptionMapper, ExceptionMapperStrategy, HttpExceptionMapper, ValueObjectExceptionMapper } from './exception-mapper.strategy';
import { ErrorMetadata, ErrorPayload, ErrorPayloadBuilder } from './payload.builder';
import { DomainException } from '@app/common-core/domain/exceptions/domain.exception';
import { ValueObjectException } from '@app/common-core/domain/exceptions/value-object.exception';
import { HttpException } from '@nestjs/common';

@Injectable()
export class ExceptionExtractorService {
    private readonly mappers: ExceptionMapperStrategy[];

    constructor() {
        this.mappers = [
            new ValueObjectExceptionMapper(), // ✅ Más específico primero
            new DomainExceptionMapper(),
            new HttpExceptionMapper(),
            new DefaultExceptionMapper(), // Siempre al final
        ];
    }

    extract(exception: any): ErrorPayload {
        const mapper = this.findMapper(exception);
        const builder = new ErrorPayloadBuilder();

        builder.withStatus(mapper.mapToStatus(exception));

        // Extraer detalles según el tipo de excepción
        const details = this.extractDetails(exception, mapper);
        builder.addDetails(details);

        // ✅ SIEMPRE agregar metadata
        const meta = this.extractMetadata(exception, mapper);
        builder.withMeta(meta);

        return builder.build();
    }

    private findMapper(exception: any): ExceptionMapperStrategy {
        return this.mappers.find(mapper => mapper.canHandle(exception)) ||
            new DefaultExceptionMapper();
    }

    private extractDetails(exception: any, mapper: ExceptionMapperStrategy): any[] {
        // Si ya tiene details estructurado
        if (Array.isArray(exception?.details)) {
            return exception.details.map((d: any) => ({
                message: d.message || String(d),
                code: d.code || mapper.mapToCode(exception),
                param: d.param,
            }));
        }

        // Si tiene error.details (RPC)
        if (Array.isArray(exception?.error?.details)) {
            return exception.error.details;
        }

        // Si es HttpException con array de mensajes (validation)
        if (Array.isArray(exception?.getResponse?.()?.message)) {
            return exception.getResponse().message.map((msg: string) => ({
                message: msg,
                code: 'VALIDATION_ERROR',
            }));
        }

        // Single message
        const message = this.extractMessage(exception);
        return [{
            message,
            code: mapper.mapToCode(exception),
            param: exception.details || exception.param,
        }];
    }

    private extractMessage(exception: any): string {
        if (exception?.error?.message) return String(exception.error.message);
        if (exception?.message) return String(exception.message);
        if (typeof exception === 'string') return exception;

        const response = exception?.getResponse?.();
        if (typeof response === 'string') return response;
        if (response?.message) return String(response.message);

        return 'Internal server error';
    }

    // ✅ MEJORADO: Extraer metadata verificando instanceof
    private extractMetadata(exception: any, mapper: ExceptionMapperStrategy): ErrorMetadata {
        const exceptionName = exception?.exceptionName || exception?.name;

        // ✅ Determinar el tipo base correcto usando instanceof
        let exceptionType: string;

        if (exception instanceof ValueObjectException) {
            exceptionType = 'ValueObjectException';
        } else if (exception instanceof DomainException) {
            exceptionType = 'DomainException';
        } else if (exception instanceof HttpException) {
            exceptionType = 'HttpException';
        } else if (exception?.constructor?.name && exception.constructor.name !== 'Object') {
            exceptionType = exception.constructor.name;
        } else {
            // Fallback al mapper
            exceptionType = this.getMapperType(mapper);
        }

        return {
            exceptionType,
            exceptionName,
        };
    }

    // ✅ Determinar el tipo basado en el mapper usado
    private getMapperType(mapper: ExceptionMapperStrategy): string {
        if (mapper instanceof DomainExceptionMapper) {
            return 'DomainException';
        }
        if (mapper instanceof ValueObjectExceptionMapper) {
            return 'ValueObjectException';
        }
        if (mapper instanceof HttpExceptionMapper) {
            return 'HttpException';
        }
        return 'UnknownException';
    }
}