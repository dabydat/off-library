import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBooksQuery } from './get-books.query';
import { Inject } from '@nestjs/common';
import { BOOK_REPOSITORY, type BookRepository } from '../../../domain/repositories/book.repository';
import { Book } from '../../../domain/models/book';

@QueryHandler(GetBooksQuery)
export class GetBooksHandler implements IQueryHandler<GetBooksQuery> {
    constructor(
        @Inject(BOOK_REPOSITORY)
        private readonly bookRepository: BookRepository
    ) { }

    async execute(query: GetBooksQuery): Promise<Book[]> {
        return this.bookRepository.findAll();
    }
}
