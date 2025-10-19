import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, EachMessagePayload, Kafka, Producer } from 'kafkajs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { QueueService } from '@app/common-core/domain/services/queue.service';

@Injectable()
export class KafkaService implements QueueService, OnModuleDestroy {
    private readonly kafka: Kafka;
    private readonly consumers: Map<string, Consumer> = new Map();
    private readonly producer: Producer;

    public constructor(
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
            await this.producer.connect();
        } catch (error) {
            this.logger.error(`Failed to connect producer: ${error.message}`);
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
