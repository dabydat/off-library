import { AggregateRoot, IEvent } from '@nestjs/cqrs';

export const PUBLISHER_PORT = Symbol('PUBLISHER_PORT');

export interface PublisherPort {
    mergeObjectContext<T extends AggregateRoot<IEvent>>(aggregate: T, event: IEvent): T;
}
