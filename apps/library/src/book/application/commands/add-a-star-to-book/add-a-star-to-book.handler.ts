import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AddAStarToBookCommand } from './add-a-star-to-book.command';
import { BOOK_REPOSITORY, type BookRepositoryPort } from '../../../domain/ports/book-repository.port';
import { Uuid } from '@app/common-core/domain/value-objects';
import { BookNotFoundException } from '../../../domain/exceptions';
import { LOGGING_PROVIDER_TOKEN, type LoggingProviderPort } from '@app/logging_provider';

@CommandHandler(AddAStarToBookCommand)
export class AddAStarToBookHandler implements ICommandHandler<AddAStarToBookCommand> {
    constructor(
        @Inject(BOOK_REPOSITORY)
        private readonly bookRepositoryPort: BookRepositoryPort,
        @Inject(LOGGING_PROVIDER_TOKEN)
        private readonly logger: LoggingProviderPort,
    ) { }
    async execute(command: AddAStarToBookCommand): Promise<void> {
        const bookId: Uuid = Uuid.create(command.bookId);

        const bookExists = await this.bookRepositoryPort.findBookById(bookId)
        if (!bookExists) throw new BookNotFoundException(`A book with this ID: ${command.bookId} not found.`);

        this.logger.info(`Adding a star to book with ID: ${command.bookId}`, {
            bookId: command.bookId,
            operation: 'add-star'
        }); bookExists.addAStarToBook();
        await this.bookRepositoryPort.save(bookExists);
    }
}
