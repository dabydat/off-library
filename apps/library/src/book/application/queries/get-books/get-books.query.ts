import { IQuery } from '@nestjs/cqrs';

export class GetBooksQuery implements IQuery {
    constructor() { }
}
