
import { TinyIntVO, UtcDate, Uuid } from '@app/common-core/domain/value-objects';
import { Book } from '../../domain/models/book';
import { BookEntity } from '../persistence/entities/book.entity';
import { BookAuthor, BookGenre, BookISBN, BookLanguage, BookName, BookPublisher, BookSummary } from '../../domain/value-objects';
import { BookResponse } from '../tcp/response/book.response';

export class BookMapper {
    public static toBookMany(bookEntities: BookEntity[]): Book[] {
        return bookEntities.map((bookEntity: BookEntity) => {
            return this.toBook(bookEntity);
        });
    }

    public static toBook(bookEntity: BookEntity): Book {
        return new Book(
            Uuid.create(bookEntity.id),
            BookName.create(bookEntity.name),
            BookAuthor.create(bookEntity.author),
            BookISBN.create(bookEntity.isbn),
            BookPublisher.create(bookEntity.publisher),
            UtcDate.create(bookEntity.publicationDate),
            BookGenre.create(bookEntity.genre),
            TinyIntVO.create(bookEntity.pages),
            BookLanguage.create(bookEntity.language),
            bookEntity.summary ? BookSummary.create(bookEntity.summary) : undefined,
            UtcDate.create(bookEntity.createdAt),
            UtcDate.create(bookEntity.updatedAt)
        );
    }

    public static toBookEntity(book: Book): BookEntity {
        const bookPrimitives = book.toPrimitives();
        const bookEntity = new BookEntity({
            id: bookPrimitives.id,
            name: bookPrimitives.name,
            author: bookPrimitives.author,
            isbn: bookPrimitives.isbn,
            publisher: bookPrimitives.publisher,
            publicationDate: new Date(bookPrimitives.publicationDate),
            genre: bookPrimitives.genre,
            pages: bookPrimitives.pages,
            language: bookPrimitives.language,
            summary: bookPrimitives.summary,
        });
        return bookEntity;
    }

    public static toBookResponse(book: Book): BookResponse {
        const bookPrimitives = book.toPrimitives();
        return {
            id: bookPrimitives.id,
            name: bookPrimitives.name,
            author: bookPrimitives.author,
            isbn: bookPrimitives.isbn,
            publisher: bookPrimitives.publisher,
            publicationDate: bookPrimitives.publicationDate,
            genre: bookPrimitives.genre,
            pages: bookPrimitives.pages,
            language: bookPrimitives.language,
            summary: bookPrimitives.summary,
            createdAt: bookPrimitives.createdAt,
            updatedAt: bookPrimitives.updatedAt
        }
    }
}