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
import { CreateBookRequest } from './request/create-book.request';
import { CreateBookCommand } from '../../application/commands/create-book/create-book.command';

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
            books.pageSize,
            books.currentPage
        );
    }

    @MessagePattern(LibraryControllerMap.CREATE_BOOK.MESSAGE_PATTERN)
    public async createBook(payload: CreateBookRequest): Promise<BookResponse> {
        const createBook = await this.commandBus.execute(
            new CreateBookCommand(
                payload.name,
                payload.author,
                payload.isbn,
                payload.publisher,
                payload.publicationDate,
                payload.genre,
                payload.pages,
                payload.language,
                payload.summary
            )
        );

        return BookMapper.toBookResponse(createBook);
    }
}
