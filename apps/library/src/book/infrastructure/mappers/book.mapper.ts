
import { TinyIntVO, UtcDate, Uuid } from '@app/common-core/domain/value-objects';
import { Book } from '../../domain/models/book';
import { BookEntity } from '../persistence/entities/book.entity';
import { BookAuthor, BookGenre, BookISBN, BookLanguage, BookName, BookPublisher, BookSummary } from '../../domain/value-objects';

export class BookMapper {
    public static toBook(bookEntities: BookEntity[]): Book[] {
        return bookEntities.map((bookEntity) => {
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
        });
    }

}