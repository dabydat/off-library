import { ValueObjectException } from "@app/common-core/domain/exceptions/value-object.exception";

export class BookPublisherException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid BookPublisher value. ${message}`, BookPublisherException.name, details);
    }
}


