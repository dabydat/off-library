import { DomainException } from "@app/common-core/domain/exceptions/domain.exception";

export class BookNotFoundException extends DomainException {
    constructor(message: string, details?: string) {
        super(`Book not found. ${message}`, BookNotFoundException.name, details);
    }
}


