import { ValueObjectException } from "@app/common-core/domain/exceptions/value-object.exception";

export class BookLanguageException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid BookLanguage value. ${message}`, BookLanguageException.name, details);
    }
}


