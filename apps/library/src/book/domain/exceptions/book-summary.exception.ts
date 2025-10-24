import { ValueObjectException } from "@app/common-core/domain/exceptions/value-object.exception";

export class BookSummaryException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid BookSummary value. ${message}`, BookSummaryException.name, details);
    }
}


