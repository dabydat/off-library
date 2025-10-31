import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BuyABookCommand } from './buy-a-book.command';
import { BOOK_REPOSITORY, type BookRepositoryPort } from '../../../domain/ports/book-repository.port';
import { Uuid } from '@app/common-core/domain/value-objects';
import { BookNotFoundException } from '../../../domain/exceptions';
import { LOGGING_PROVIDER_TOKEN, type LoggingProviderPort } from '@app/logging_provider';
import { Book } from '../../../domain/models/book';

@CommandHandler(BuyABookCommand)
export class BuyABookHandler implements ICommandHandler<BuyABookCommand> {
    constructor(
        @Inject(BOOK_REPOSITORY)
        private readonly bookRepositoryPort: BookRepositoryPort,
        @Inject(LOGGING_PROVIDER_TOKEN)
        private readonly logger: LoggingProviderPort,
    ) { }
    async execute(command: BuyABookCommand): Promise<void> {
        const bookId: Uuid = Uuid.create(command.bookId);

        const bookExists: Book | null = await this.bookRepositoryPort.findBookById(bookId)
        if (!bookExists) throw new BookNotFoundException(`A book with this ID: ${command.bookId} not found.`);

        this.logger.info(`Buying book with ID: ${command.bookId}`, {
            bookId: command.bookId,
            operation: 'buy-book'
        });
        bookExists.buyBook();
        await this.bookRepositoryPort.save(bookExists);
    }
}
