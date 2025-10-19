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

@Module({
    imports: [
        // DatabaseModule,
        CqrsModule,
    ],
    controllers: [BookController],
    providers: [
        ...CommandHandlers,
        ...EventHandlers,
        ...QueryHandlers,
        {
            provide: TRANSACTION_EXECUTION_PORT,
            useClass: TransactionExecutionAdapter,
        },
        {
            provide: QUEUE_SERVICE,
            useClass: KafkaService,
        },
    ],
})
export class BookModule { }
