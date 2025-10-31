import { ModuleMetadata, Type } from '@nestjs/common';
import { WinstonOptions } from './winston-options';
import { LoggingProviderOptionsFactory } from './logging-provider-factory';

export interface LoggingProviderAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    /**
     * Dependencies that will be injected into the factory or class.
     */
    inject?: readonly any[];

    /**
     * Class that will be instantiated to create options.
     */
    useClass?: Type<LoggingProviderOptionsFactory>;

    /**
     * Existing class to use instead of creating a new instance.
     */
    useExisting?: Type<LoggingProviderOptionsFactory>;

    /**
     * Factory function that returns CacheProviderOptions or a Promise thereof.
     */
    useFactory?: (...args: any[]) => WinstonOptions | Promise<WinstonOptions>;
}