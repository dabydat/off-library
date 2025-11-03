import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AddAStarToBookEvent } from '../../domain/events/add-a-star-to-book.event';
import { QUEUE_SERVICE_PORT, type QueueService } from '@app/common-core/domain/services/queue.service';
import { KafkaTopicConstant } from '@app/common-core/infrastructure/constants/kafka-topic.constant';
import { AddAStarToBookMessage } from '@app/common-core/infrastructure/message/add-a-star-to-book.message';

@EventsHandler(AddAStarToBookEvent)
export class AddAStarToBookEventHandler
    implements IEventHandler<AddAStarToBookEvent> {
    constructor(
        @Inject(QUEUE_SERVICE_PORT)
        private readonly queueService: QueueService,
    ) { }

    async handle(event: AddAStarToBookEvent): Promise<void> {
        await this.queueService.publish(
            KafkaTopicConstant.ADD_A_STAR_TO_BOOK,
            KafkaTopicConstant.ADD_A_STAR_TO_BOOK,
            {
                bookId: event.bookId,
            } as AddAStarToBookMessage,
        );
    }
}
