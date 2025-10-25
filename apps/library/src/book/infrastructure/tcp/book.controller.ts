import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LibraryControllerMap } from '@app/common-core/domain/constants/library.constant';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBooksQuery } from '../../application/queries/get-books/get-books.query';
import { GetBooksRequest } from './request/get-books.request';
import { PaginatedResponse } from '@app/common-core/domain/types/paginate-response.type';
import { BookMapper } from '../mappers/book.mapper';
import { Book } from '../../domain/models/book';
import { BookResponse } from './response/book.response';

@Controller()
export class BookController {
    public constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) { }

    @MessagePattern(LibraryControllerMap.GET_BOOKS.MESSAGE_PATTERN)
    public async getBooks(payload: GetBooksRequest): Promise<PaginatedResponse<BookResponse>> {
        const books = await this.queryBus.execute(new GetBooksQuery(
            payload.limit,
            payload.page
        ));
        return new PaginatedResponse(
            books.items.map((book: Book) => BookMapper.toBookResponse(book)),
            books.totalItems,
            books.totalPages,
            books.currentPage,
            books.pageSize
        )
    }
}
