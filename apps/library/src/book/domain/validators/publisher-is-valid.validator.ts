import { IsPublisherValidValidatorException } from "../exceptions";
import { Book } from "../models/book";

export class IsPublisherValidValidator {
    public constructor(private readonly book: Book) { }

    publishersExcluded = [
        'Fake Publisher',
        'Invalid Publisher',
        'Unknown Publisher'
    ]

    public validate(): void {
        this.validateIsPublisherValid();
    }

    private validateIsPublisherValid(): void {
        const primitives = this.book.toPrimitives();
        const comingPublisher = primitives.publisher;
        if (this.publishersExcluded.includes(comingPublisher)) {
            throw new IsPublisherValidValidatorException(`The publisher "${comingPublisher}" is not allowed.`);
        }
    }
}
