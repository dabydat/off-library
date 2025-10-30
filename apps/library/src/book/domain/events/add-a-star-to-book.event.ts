import { IEvent } from '@nestjs/cqrs';

export class AddAStarToBookEvent implements IEvent {
    constructor(
        public readonly bookId: string,
    ) { }
}