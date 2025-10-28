import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { DomainException } from '@app/common-core/domain/exceptions/domain.exception';
import { ValueObjectException } from '@app/common-core/domain/exceptions/value-object.exception';
import {
    DefaultExceptionMapper,
    DomainExceptionMapper,
    ExceptionMapperStrategy,
    HttpExceptionMapper,
    ValueObjectExceptionMapper
} from './exception-mapper.strategy';
import { ErrorMetadata, ErrorPayload, ErrorPayloadBuilder } from './payload.builder';

@Injectable()
export class ExceptionExtractorService {
    private readonly mappers: ExceptionMapperStrategy[];

    constructor() {
        this.mappers = [
            new ValueObjectExceptionMapper(),
            new DomainExceptionMapper(),
            new HttpExceptionMapper(),
            new DefaultExceptionMapper(),
        ];
    }

    extract(exception: any): ErrorPayload {
        const mapper = this.findMapper(exception);
        const builder = new ErrorPayloadBuilder();

        builder.withStatus(mapper.mapToStatus(exception));

        const details = this.extractDetails(exception, mapper);
        builder.addDetails(details);

        const meta = this.extractMetadata(exception, mapper);
        builder.withMeta(meta);

        return builder.build();
    }

    private findMapper(exception: any): ExceptionMapperStrategy {
        return this.mappers.find(mapper => mapper.canHandle(exception)) ||
            new DefaultExceptionMapper();
    }

    private extractDetails(exception: any, mapper: ExceptionMapperStrategy): any[] {
        if (Array.isArray(exception?.details)) {
            return exception.details.map((d: any) => ({
                message: d.message || String(d),
                code: d.code || mapper.mapToCode(exception),
                param: d.param,
            }));
        }

        if (Array.isArray(exception?.error?.details)) {
            return exception.error.details;
        }

        if (Array.isArray(exception?.getResponse?.()?.message)) {
            return exception.getResponse().message.map((msg: string) => ({
                message: msg,
                code: 'VALIDATION_ERROR',
            }));
        }

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

    private extractMetadata(exception: any, mapper: ExceptionMapperStrategy): ErrorMetadata {
        const exceptionName = exception?.exceptionName || exception?.name;
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
            exceptionType = this.getMapperType(mapper);
        }

        return { exceptionType, exceptionName };
    }

    private getMapperType(mapper: ExceptionMapperStrategy): string {
        if (mapper instanceof DomainExceptionMapper) return 'DomainException';
        if (mapper instanceof ValueObjectExceptionMapper) return 'ValueObjectException';
        if (mapper instanceof HttpExceptionMapper) return 'HttpException';
        return 'UnknownException';
    }
}