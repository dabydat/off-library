import { DomainException } from "@app/common-core/domain/exceptions/domain.exception";

export class IsPublisherValidValidatorException extends DomainException {
    constructor(message: string, details?: string) {
        super(`Invalid publisher value. ${message}`, IsPublisherValidValidatorException.name, details);
    }
}


