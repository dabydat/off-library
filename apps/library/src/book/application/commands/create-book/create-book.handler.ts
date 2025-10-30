import { BookSummary } from './../../../domain/value-objects/book-summary';
import { BookLanguage } from './../../../domain/value-objects/book-language';
import { BookGenre } from './../../../domain/value-objects/book-genre';
import { BookPublisher } from './../../../domain/value-objects/book-publisher';
import { BookISBN } from './../../../domain/value-objects/book-isbn';
import { BookAuthor } from './../../../domain/value-objects/book-author';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateBookCommand } from './create-book.command';
import { BOOK_REPOSITORY, type BookRepositoryPort } from '../../../domain/ports/book-repository.port';
import { Book, BookPrimitives } from '../../../domain/models/book';
import { BookName } from '../../../domain/value-objects';
import { TinyIntVO, UtcDate } from '@app/common-core/domain/value-objects';
import { BookAlreadyExistsException } from '../../../domain/exceptions';
import { AddAStarToBookEvent } from '../../../domain/events/add-a-start-to-book.event';
import { PUBLISHER_PORT, type PublisherPort } from '../../../domain/ports/publisher.port';

@CommandHandler(CreateBookCommand)
export class CreateBookHandler implements ICommandHandler<CreateBookCommand> {
    constructor(
        @Inject(BOOK_REPOSITORY)
        private readonly bookRepositoryPort: BookRepositoryPort,
        @Inject(PUBLISHER_PORT)
        private readonly publisherPort: PublisherPort
    ) { }
    async execute(command: CreateBookCommand): Promise<Book> {

        const bookExists = await this.bookRepositoryPort.findBookByISBN(
            BookISBN.create(command.isbn)
        )

        if (bookExists) throw new BookAlreadyExistsException(`A book with this ISBN: ${command.isbn} already exists.`);

        const newBook: Book = Book.create(
            BookName.create(command.name),
            BookAuthor.create(command.author),
            BookISBN.create(command.isbn),
            BookPublisher.create(command.publisher),
            UtcDate.create(command.publicationDate),
            BookGenre.create(command.genre),
            TinyIntVO.create(command.pages),
            BookLanguage.create(command.language),
            BookSummary.create(command.summary),
            TinyIntVO.create(0)
        );

        newBook.validateIsPublisherIsValid();
        const bookCreated: Book = await this.bookRepositoryPort.save(newBook);

        const bookPrimitives: BookPrimitives = bookCreated.toPrimitives();

        this.publisherPort.mergeObjectContext(bookCreated);
        bookCreated.apply(new AddAStarToBookEvent(bookPrimitives.id));
        bookCreated.commit();
        return bookCreated;
    }
}
