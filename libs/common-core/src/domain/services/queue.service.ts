export const QUEUE_SERVICE_PORT = Symbol('QUEUE_SERVICE');

export interface QueueService {
    publish: (topic: string, key: string, message: any) => Promise<void>;
    consume: (
        topic: string,
        handler: (message: any) => Promise<void>,
        groupId: string,
        maxRetries: number,
        retryDelayMs: number,
    ) => void;
}
