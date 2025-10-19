import { LibraryControllerMap } from '@app/common-core/domain/constants/library.constant';
import { ClientConstant } from '@app/common-core/infrastructure/constants/client.constants';
import { ApiOkResponsePaginated } from '@app/common-core/infrastructure/decorators/api-ok-response-paginated.decorator';
import { ErrorResponse } from '@app/common-core/infrastructure/rest/error.response';
import { Controller, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('library')
export class LibraryController {
    constructor(
        @Inject(ClientConstant.LIBRARY_CLIENT)
        private readonly libraryClient: ClientProxy,
    ) { }

    @Get(LibraryControllerMap.GET_BOOKS.ROUTE)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Get services' })
    @ApiOkResponsePaginated({ type: String })
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
    getBooks() {
        return this.libraryClient.send(LibraryControllerMap.GET_BOOKS.MESSAGE_PATTERN, {});
    }
}
