import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBooksQuery } from './get-books.query';
import { Inject } from '@nestjs/common';
import { Book } from '../../../domain/models/book';
import { BOOK_REPOSITORY, type BookRepositoryPort } from '../../../domain/ports/book-repository.port';
import { Pagination } from '@app/common-core/domain/value-objects/pagination';
import { DomainPagination } from '@app/common-core/domain/types/domain-pagination.type';

@QueryHandler(GetBooksQuery)
export class GetBooksHandler implements IQueryHandler<GetBooksQuery> {
    constructor(
        @Inject(BOOK_REPOSITORY)
        private readonly bookRepository: BookRepositoryPort
    ) { }

    async execute(query: GetBooksQuery): Promise<DomainPagination<Book[]>> {
        const { limit, page } = query;
        const pagination = Pagination.create(page, limit);
        return this.bookRepository.findAll(pagination);
    }
}
