import { DomainException } from "@app/common-core/domain/exceptions/domain.exception";

export class BookAlreadyExistsException extends DomainException {
    constructor(message: string, details?: string) {
        super(`Book already exists. ${message}`, BookAlreadyExistsException.name, details);
    }
}


