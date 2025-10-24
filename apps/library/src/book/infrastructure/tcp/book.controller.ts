import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LibraryControllerMap } from '@app/common-core/domain/constants/library.constant';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBooksQuery } from '../../application/queries/get-books/get-books.query';

@Controller()
export class BookController {
    public constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) { }

    @MessagePattern(LibraryControllerMap.GET_BOOKS.MESSAGE_PATTERN)
    public async getBooks(): Promise<any> {
        return await this.queryBus.execute(new GetBooksQuery());
    }
}
