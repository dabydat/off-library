import { BookSummary } from '../../../domain/value-objects/book-summary';
import { BookLanguage } from '../../../domain/value-objects/book-language';
import { BookGenre } from '../../../domain/value-objects/book-genre';
import { BookPublisher } from '../../../domain/value-objects/book-publisher';
import { BookISBN } from '../../../domain/value-objects/book-isbn';
import { BookAuthor } from '../../../domain/value-objects/book-author';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AddAStarToBookCommand } from './add-a-star-to-book.command';
import { BOOK_REPOSITORY, type BookRepositoryPort } from '../../../domain/ports/book-repository.port';
import { Book, BookPrimitives } from '../../../domain/models/book';
import { BookName } from '../../../domain/value-objects';
import { TinyIntVO, UtcDate, Uuid } from '@app/common-core/domain/value-objects';
import { BookAlreadyExistsException, BookNotFoundException } from '../../../domain/exceptions';
import { AddAStarToBookEvent } from '../../../domain/events/add-a-start-to-book.event';

@CommandHandler(AddAStarToBookCommand)
export class AddAStarToBookHandler implements ICommandHandler<AddAStarToBookCommand> {
    constructor(
        @Inject(BOOK_REPOSITORY)
        private readonly bookRepositoryPort: BookRepositoryPort
    ) { }
    async execute(command: AddAStarToBookCommand): Promise<Book> {
        const bookId: Uuid = Uuid.create(command.bookId);

        const bookExists = await this.bookRepositoryPort.findBookById(bookId)

        if (!bookExists) throw new BookNotFoundException(`A book with this ID: ${command.bookId} not found.`);

        bookExists.addAStarToBook();

        const addStarToBook: Book = await this.bookRepositoryPort.save(bookExists);

        return addStarToBook;
    }
}
