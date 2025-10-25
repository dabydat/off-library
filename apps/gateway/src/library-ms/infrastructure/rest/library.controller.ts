import { LibraryControllerMap } from '@app/common-core/domain/constants/library.constant';
import { ClientConstant } from '@app/common-core/infrastructure/constants/client.constants';
import { ApiOkResponsePaginated } from '@app/common-core/infrastructure/decorators/api-ok-response-paginated.decorator';
import { ErrorResponse } from '@app/common-core/infrastructure/rest/error.response';
import { Controller, Get, HttpCode, HttpStatus, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetBooksRequest } from './request/get-books.request';
import { DomainPagination } from '@app/common-core/domain/types/domain-pagination.type';
import { firstValueFrom } from 'rxjs';
import { GetBooksResponse } from './response/get-books.response';

@Controller('library')
export class LibraryController {
    constructor(
        @Inject(ClientConstant.LIBRARY_CLIENT)
        private readonly libraryClient: ClientProxy,
    ) { }

    @Get(LibraryControllerMap.GET_BOOKS.ROUTE)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Get Books' })
    @ApiOkResponsePaginated({ type: GetBooksResponse, description: 'List of books retrieved successfully' })
    @ApiBadRequestResponse({
        description: 'Invalid request parameters',
        type: ErrorResponse,
    })
    @ApiNotFoundResponse({
        description: 'Resource not found',
        type: ErrorResponse,
    })
    @ApiInternalServerErrorResponse({
        description: 'Unexpected server error',
        type: ErrorResponse,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized access',
        type: ErrorResponse,
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded',
        type: ErrorResponse,
    })
    async getBooks(@Query() query: GetBooksRequest): Promise<DomainPagination<GetBooksResponse>> {
        return await firstValueFrom(this.libraryClient.send(LibraryControllerMap.GET_BOOKS.MESSAGE_PATTERN, query));
    }
}
