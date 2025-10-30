import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../config/database/database.module';
import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event-handlers';
import { BookController } from './infrastructure/tcp/book.controller';
import { QueryHandlers } from './application/queries';
import { TRANSACTION_EXECUTION_PORT } from './domain/ports/transaction-execution.port';
import { TransactionExecutionAdapter } from './infrastructure/adapters/transaction-execution.adapter';
import { QUEUE_SERVICE } from '@app/common-core/domain/services/queue.service';
import { KafkaService } from './infrastructure/queue/kafka.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './infrastructure/persistence/entities/book.entity';
import { BOOK_REPOSITORY } from './domain/ports/book-repository.port';
import { BookRepositoryAdapter } from './infrastructure/adapters/book.repository.adapter';
import { PUBLISHER_PORT } from './domain/ports/publisher.port';
import { PublisherAdapter } from './infrastructure/adapters/publisher.adapter';

@Module({
    imports: [
        DatabaseModule,
        CqrsModule,
        TypeOrmModule.forFeature([
            BookEntity
        ])
    ],
    controllers: [BookController],
    providers: [
        ...CommandHandlers,
        ...EventHandlers,
        ...QueryHandlers,
        {
            provide: PUBLISHER_PORT,
            useClass: PublisherAdapter,
        },
        {
            provide: TRANSACTION_EXECUTION_PORT,
            useClass: TransactionExecutionAdapter,
        },
        {
            provide: QUEUE_SERVICE,
            useClass: KafkaService,
        },
        {
            provide: BOOK_REPOSITORY,
            useClass: BookRepositoryAdapter,
        }
    ],
})
export class BookModule { }
