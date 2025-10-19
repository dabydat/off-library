import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBooksQuery } from './get-books.query';

@QueryHandler(GetBooksQuery)
export class GetBooksHandler implements IQueryHandler<GetBooksQuery> {
    constructor() { }

    async execute(query: GetBooksQuery): Promise<string> {
        return 'This action returns all books';
    }
}
