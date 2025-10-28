import { IQuery } from '@nestjs/cqrs';

export class GetBooksQuery implements IQuery {
    constructor(
        public readonly limit: number,
        public readonly page: number,
    ) { }
}
