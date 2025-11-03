import { DomainException } from "@app/common-core/domain/exceptions/domain.exception";

export class IsBookInStockValidatorException extends DomainException {
    constructor(message: string, details?: string) {
        super(`This book is not in stock. ${message}`, IsBookInStockValidatorException.name, details);
    }
}


