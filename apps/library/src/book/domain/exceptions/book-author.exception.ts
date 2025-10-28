import { ValueObjectException } from "@app/common-core/domain/exceptions/value-object.exception";

export class BookAuthorException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid BookAuthor value. ${message}`, BookAuthorException.name, details);
    }
}


