import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../config/database/database.module';

import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event-handlers';
import { BookController } from './infrastructure/tcp/book.controller';
import { QueryHandlers } from './application/queries';
import { TRANSACTION_EXECUTION_PORT } from './domain/ports/transaction-execution.port';
import { TransactionExecutionAdapter } from './infrastructure/adapters/transaction-execution.adapter';
import { QUEUE_SERVICE_PORT } from '@app/common-core/domain/services/queue.service';
import { KafkaService } from './infrastructure/queue/kafka.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './infrastructure/persistence/entities/book.entity';
import { BOOK_REPOSITORY_PORT } from './domain/ports/book-repository.port';
import { BookRepositoryAdapter } from './infrastructure/adapters/book.repository.adapter';
import { PUBLISHER_PORT } from './domain/ports/publisher.port';
import { PublisherAdapter } from './infrastructure/adapters/publisher.adapter';
import { BookEventConsumerService } from './infrastructure/queue/listeners/book-event-consumer.service';
import { FactusCoreModule } from '@app/factus_core';
import { ConfigService } from '@nestjs/config';
import { FactusAdapter } from './infrastructure/factus/factus.service';
import { FACTUS_PORT } from './domain/ports/factus.port';
import { CacheProviderModule } from '@app/cache_provider';


@Module({
    imports: [
        DatabaseModule,
        CqrsModule,
        TypeOrmModule.forFeature([
            BookEntity
        ]),
        CacheProviderModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                host: `${config.get<string>('cache.host')}:${config.get<number>('cache.port')}`,
            })
        }),
        FactusCoreModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                url: config.get<string>('factus.urlApi')!,
                clientId: config.get<string>('factus.clientId')!,
                clientSecret: config.get<string>('factus.clientSecret')!,
                username: config.get<string>('factus.username')!,
                password: config.get<string>('factus.password')!,
            })
        })
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
            provide: QUEUE_SERVICE_PORT,
            useClass: KafkaService,
        },
        {
            provide: BOOK_REPOSITORY_PORT,
            useClass: BookRepositoryAdapter,
        },
        {
            provide: FACTUS_PORT,
            useClass: FactusAdapter,
        },
        BookEventConsumerService,
    ],
})
export class BookModule { }
