import { BookSummary } from './../../../domain/value-objects/book-summary';
import { BookLanguage } from './../../../domain/value-objects/book-language';
import { TinyIntVO } from './../../../../../../../libs/common-core/src/domain/value-objects/tinyint-vo';
import { BookGenre } from './../../../domain/value-objects/book-genre';
import { BookPublisher } from './../../../domain/value-objects/book-publisher';
import { BookISBN } from './../../../domain/value-objects/book-isbn';
import { BookAuthor } from './../../../domain/value-objects/book-author';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateBookCommand } from './create-book.command';
import { BOOK_REPOSITORY } from '../../../domain/ports/book-repository.port';
import { BookRepositoryAdapter } from '../../../infrastructure/adapters/book.repository.adapter';
import { Book } from '../../../domain/models/book';
import { BookName } from '../../../domain/value-objects';
import { UtcDate } from '@app/common-core/domain/value-objects';
import { BookAlreadyExistsException } from '../../../domain/exceptions';

@CommandHandler(CreateBookCommand)
export class CreateBookHandler implements ICommandHandler<CreateBookCommand> {
    constructor(
        @Inject(BOOK_REPOSITORY)
        private readonly bookRepositoryAdapter: BookRepositoryAdapter
    ) { }
    async execute(command: CreateBookCommand): Promise<Book> {

        const bookExists = await this.bookRepositoryAdapter.findBookByISBN(
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
            BookSummary.create(command.summary)
        );

        newBook.validateIsPublisherIsValid();
        const bookCreated: Book = await this.bookRepositoryAdapter.create(newBook);
        return bookCreated;
    }
}
