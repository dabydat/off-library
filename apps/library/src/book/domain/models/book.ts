import { AggregateRoot } from "@nestjs/cqrs";
import { BookAuthor, BookGenre, BookGenreEnum, BookISBN, BookLanguage, BookLanguageEnum, BookName, BookPublisher, BookSummary } from "../value-objects";
import { TinyIntVO, UtcDate, Uuid } from "@app/common-core/domain/value-objects";
import { IsPublisherValidValidator } from "../validators/publisher-is-valid.validator";

export type BookPrimitives = {
    id: string;
    name: string;
    author: string;
    isbn: string;
    publisher: string;
    publicationDate: string;
    genre: BookGenreEnum;
    pages: number;
    language: BookLanguageEnum;
    summary?: string;
    createdAt?: string;
    updatedAt?: string;
    starsCount: number;
};

export class Book extends AggregateRoot {
    constructor(
        private readonly id: Uuid,
        private readonly name: BookName,
        private readonly author: BookAuthor,
        private readonly isbn: BookISBN,
        private readonly publisher: BookPublisher,
        private readonly publicationDate: UtcDate,
        private readonly genre: BookGenre,
        private readonly pages: TinyIntVO,
        private readonly language: BookLanguage,
        private readonly summary?: BookSummary,
        private readonly createdAt?: UtcDate,
        private readonly updatedAt?: UtcDate,
        private starsCount?: TinyIntVO
    ) {
        super();
    }

    public toPrimitives(): BookPrimitives {
        return {
            id: this.id.getValue,
            name: this.name.getValue,
            author: this.author.getValue,
            isbn: this.isbn.getValue,
            publisher: this.publisher.getValue,
            publicationDate: this.publicationDate.toISOString,
            genre: this.genre.getValue,
            pages: this.pages.getValue,
            language: this.language.getValue,
            summary: this.summary?.getValue,
            createdAt: this.createdAt?.toISOString,
            updatedAt: this.updatedAt?.toISOString,
            starsCount: this.starsCount?.getValue ?? 0,
        };
    }

    public static create(
        name: BookName,
        author: BookAuthor,
        isbn: BookISBN,
        publisher: BookPublisher,
        publicationDate: UtcDate,
        genre: BookGenre,
        pages: TinyIntVO,
        language: BookLanguage,
        summary?: BookSummary,
        starsCount?: TinyIntVO
    ): Book {
        return new Book(
            Uuid.create(),
            name,
            author,
            isbn,
            publisher,
            publicationDate,
            genre,
            pages,
            language,
            summary,
            UtcDate.now(),
            UtcDate.now(),
            starsCount
        );
    }

    public validateIsPublisherIsValid(): void {
        new IsPublisherValidValidator(this).validate();
    }

    public addAStarToBook(): void {
        this.starsCount = TinyIntVO.create((this.starsCount?.getValue ?? 0) + 1);
    }
}