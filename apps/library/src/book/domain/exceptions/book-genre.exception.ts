import { ValueObjectException } from "@app/common-core/domain/exceptions/value-object.exception";

export class BookGenreException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid BookGenre value. ${message}`, BookGenreException.name, details);
    }
}


