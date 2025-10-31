import { WinstonOptions } from './winston-options';

export interface LoggingProviderOptionsFactory {
    createWinstonOptions(): Promise<WinstonOptions> | WinstonOptions;
}