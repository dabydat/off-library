import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, EachMessagePayload, Kafka, Producer } from 'kafkajs';
import { LOGGING_PROVIDER_TOKEN, type LoggingProviderPort } from '@app/logging_provider';
import { QueueService } from '@app/common-core/domain/services/queue.service';

@Injectable()
export class KafkaService implements QueueService, OnModuleDestroy {
    private readonly kafka: Kafka;
    private readonly consumers: Map<string, Consumer> = new Map();
    private readonly producer: Producer;

    public constructor(
        private readonly configService: ConfigService,
        @Inject(LOGGING_PROVIDER_TOKEN) private readonly logger: LoggingProviderPort,
    ) {
        const clientId: string = this.configService.get<string>('kafka.clientId')!;
        const broker: string = this.configService.get<string>('kafka.broker')!;

        this.kafka = new Kafka({
            clientId: clientId,
            brokers: [broker],
        });

        this.producer = this.kafka.producer();
        this.connectProducer();
    }

    private async connectProducer(): Promise<void> {
        try {
            this.logger.info('Connecting Kafka producer', { operation: 'connect_producer' });
            await this.producer.connect();
            this.logger.info('Kafka producer connected successfully', { status: 'connected' });
        } catch (error) {
            this.logger.error(`Failed to connect producer: ${error.message}`, {
                operation: 'connect_producer',
                error: error.message
            });
            throw error;
        }
    }

    public async onModuleDestroy(): Promise<void> {
        for (const consumer of this.consumers.values()) {
            await consumer.disconnect();
        }

        if (this.producer) {
            await this.producer.disconnect();
        }
    }

    public async publish(
        topic: string,
        key: string,
        message: any,
    ): Promise<void> {
        await this.producer.send({
            topic,
            messages: [
                {
                    key,
                    value: JSON.stringify(message),
                },
            ],
        });
    }

    public consume(
        topic: string,
        handler: (message: any) => Promise<void>,
        groupId: string,
        maxRetries: number,
        retryDelayMs: number,
    ): void {
        (async (): Promise<void> => {
            if (this.consumers.has(groupId)) {
                this.logger.warn(`Consumer already exists for groupId: ${groupId}`);
                return;
            }

            const consumer: Consumer = this.kafka.consumer({
                groupId,
                retry: {
                    retries: maxRetries,
                    initialRetryTime: retryDelayMs,
                    factor: 2,
                },
            });

            this.consumers.set(groupId, consumer);

            await consumer.connect();
            await consumer.subscribe({ topic });

            await consumer.run({
                eachMessage: async ({ message }: EachMessagePayload): Promise<void> => {
                    try {
                        const parsedMessage: any = JSON.parse(
                            message?.value?.toString() || '{}',
                        );
                        await handler(parsedMessage);
                    } catch (error) {
                        this.logger.error(`Error processing message: ${error.message}`);
                    }
                },
            });
        })();
    }
}
