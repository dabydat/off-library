import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AddAStarToBookCommand } from './add-a-star-to-book.command';
import { BOOK_REPOSITORY, type BookRepositoryPort } from '../../../domain/ports/book-repository.port';
import { Uuid } from '@app/common-core/domain/value-objects';
import { BookNotFoundException } from '../../../domain/exceptions';
import { LOGGER_PORT, type LoggerPort } from '../../../domain/ports/logger.port';

@CommandHandler(AddAStarToBookCommand)
export class AddAStarToBookHandler implements ICommandHandler<AddAStarToBookCommand> {
    constructor(
        @Inject(BOOK_REPOSITORY)
        private readonly bookRepositoryPort: BookRepositoryPort,
        @Inject(LOGGER_PORT)
        private readonly loggerPort: LoggerPort
    ) { }
    async execute(command: AddAStarToBookCommand): Promise<void> {
        const bookId: Uuid = Uuid.create(command.bookId);

        const bookExists = await this.bookRepositoryPort.findBookById(bookId)
        if (!bookExists) throw new BookNotFoundException(`A book with this ID: ${command.bookId} not found.`);

        this.loggerPort.info(`Adding a star to book with ID: ${command.bookId}`);

        bookExists.addAStarToBook();
        await this.bookRepositoryPort.save(bookExists);
    }
}
