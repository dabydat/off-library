import * as winston from 'winston';

export interface WinstonOptions {
    level?: string;
    silent?: boolean;
    format?: winston.Logform.Format;
    transports?: winston.transport[];
    exitOnError?: boolean;
}