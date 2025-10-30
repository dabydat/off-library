import { Injectable } from '@nestjs/common';
import { EventPublisher, AggregateRoot, IEvent } from '@nestjs/cqrs';
import { PublisherPort } from '../../domain/ports/publisher.port';

@Injectable()
export class PublisherAdapter implements PublisherPort {
  constructor(private readonly publisher: EventPublisher) { }

  mergeObjectContext<T extends AggregateRoot<IEvent>>(aggregate: T, event: IEvent): T {
    this.publisher.mergeObjectContext(aggregate);
    aggregate.apply(event);
    aggregate.commit();
    return aggregate;
  }
}
