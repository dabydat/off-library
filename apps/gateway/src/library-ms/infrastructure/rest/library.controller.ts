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
    async getBooks(@Query() query: GetBooksRequest): Promise<RestPaginationResponse<GetBooksResponse>> {
        return await firstValueFrom(this.libraryClient.send(LibraryControllerMap.GET_BOOKS.MESSAGE_PATTERN, query));
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
        return await firstValueFrom(this.libraryClient.send(LibraryControllerMap.CREATE_BOOK.MESSAGE_PATTERN, {
            ...body,
            publicationDate: body.publication_date,
            availableCopies: body.available_copies,
        }));
    }
}
