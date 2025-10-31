import { LibraryControllerMap, LibraryControllerName } from '@app/common-core/domain/constants/library.constant';
import { ClientConstant } from '@app/common-core/infrastructure/constants/client.constants';
import { ApiOkResponsePaginated } from '@app/common-core/infrastructure/decorators/api-ok-response-paginated.decorator';
import { ErrorResponse } from '@app/common-core/infrastructure/rest/error.response';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Put, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetBooksRequest } from './request/get-books.request';
import { firstValueFrom } from 'rxjs';
import { GetBooksResponse } from './response/get-books.response';
import { RestPaginationResponse } from '@app/common-core/infrastructure/rest/rest-pagination.response';
import { CreateBookRequest } from './request/create-book.request';
import { GetBookResponse } from './response/get-book.response';

@Controller(LibraryControllerName)
export class LibraryController {
    constructor(
        @Inject(ClientConstant.LIBRARY_CLIENT)
        private readonly libraryClient: ClientProxy,
    ) { }

    @Get(LibraryControllerMap.GET_BOOKS.ROUTE)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Get Books' })
    @ApiOkResponsePaginated({ type: GetBooksResponse, description: 'List of books retrieved successfully' })
    @ApiBadRequestResponse({ description: 'Invalid request parameters', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Resource not found', type: ErrorResponse })
    @ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized access', type: ErrorResponse })
    @ApiTooManyRequestsResponse({ description: 'Too many requests - rate limit exceeded', type: ErrorResponse })
    async getBooks(@Query() query: GetBooksRequest): Promise<RestPaginationResponse<GetBooksResponse[]>> {
        const books = await firstValueFrom(this.libraryClient.send(LibraryControllerMap.GET_BOOKS.MESSAGE_PATTERN, query));
        const booksResponse: GetBooksResponse[] = books.elements.map((book: any) => ({
            id: book.id,
            name: book.name,
            author: book.author,
            isbn: book.isbn,
            publisher: book.publisher,
            genre: book.genre,
            pages: book.pages,
            language: book.language,
            summary: book.summary,
            price: book.price,
            publication_date: book.publicationDate,
            available_copies: book.availableCopies,
            stars: book.starsCount,
            created_at: book.createdAt,
            updated_at: book.updatedAt,
        }));

        return {
            elements: booksResponse,
            total_elements: books.totalElements,
            total_pages: books.totalPages,
            limit: books.limit,
            page: books.page,
        };
    }

    @Put(LibraryControllerMap.CREATE_BOOK.ROUTE)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Create a Book' })
    @ApiOkResponse({ type: GetBookResponse, description: 'Book created successfully' })
    @ApiBadRequestResponse({ description: 'Invalid request parameters', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Resource not found', type: ErrorResponse })
    @ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized access', type: ErrorResponse })
    @ApiTooManyRequestsResponse({ description: 'Too many requests - rate limit exceeded', type: ErrorResponse })
    async createBook(@Body() body: CreateBookRequest): Promise<GetBookResponse> {
        const book = await firstValueFrom(this.libraryClient.send(LibraryControllerMap.CREATE_BOOK.MESSAGE_PATTERN, {
            ...body,
            publicationDate: body.publication_date,
            availableCopies: body.available_copies,
        }));

        const bookResponse: GetBookResponse = {
            id: book.id,
            name: book.name,
            author: book.author,
            isbn: book.isbn,
            publisher: book.publisher,
            genre: book.genre,
            pages: book.pages,
            language: book.language,
            summary: book.summary,
            price: book.price,
            publication_date: book.publicationDate,
            available_copies: book.availableCopies,
            stars: book.starsCount,
            created_at: book.createdAt,
            updated_at: book.updatedAt,
        };

        return bookResponse;
    }
}
