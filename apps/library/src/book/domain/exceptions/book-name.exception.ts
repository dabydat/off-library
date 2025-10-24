import { ValueObjectException } from "@app/common-core/domain/exceptions/value-object.exception";

export class BookNameException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid BookName value. ${message}`, BookNameException.name, details);
    }
}


