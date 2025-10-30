import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { QUEUE_SERVICE, type QueueService } from '@app/common-core/domain/services/queue.service';
import { KafkaTopicConstant } from '@app/common-core/infrastructure/constants/kafka-topic.constant';
import { AddAStarToBookMessage } from '@app/common-core/infrastructure/message/add-a-star-to-book.message';
import { KafkaGroupsConstant } from '@app/common-core/infrastructure/constants/kafka-groups.constant';
import { AddAStarToBookCommand } from '../../../application/commands/add-a-star-to-book/add-a-star-to-book.command';

@Injectable()
export class BookEventConsumerService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus,
    @Inject(QUEUE_SERVICE)
    private readonly queueService: QueueService,
  ) { }

  public onModuleInit(): void {
    this.userAuthenticatedSuccessfully();
  }

  private userAuthenticatedSuccessfully(): void {
    const maxRetries: number =
      this.configService.get<number>('kafka.maxTries')!;
    const retryDelayMs: number =
      this.configService.get<number>('kafka.retryDelayMs')!;

    this.queueService.consume(
      KafkaTopicConstant.ADD_A_STAR_TO_BOOK,
      async (message: AddAStarToBookMessage): Promise<void> => {
        await this.commandBus.execute(
          new AddAStarToBookCommand(
            message.bookId,
          ),
        );
      },
      KafkaGroupsConstant.ADD_A_STAR_TO_BOOK_GROUP,
      maxRetries,
      retryDelayMs,
    );
  }
}
