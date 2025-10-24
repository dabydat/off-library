import { ValueObjectException } from "@app/common-core/domain/exceptions/value-object.exception";

export class BookISBNException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid BookISBN value. ${message}`, BookISBNException.name, details);
    }
}


