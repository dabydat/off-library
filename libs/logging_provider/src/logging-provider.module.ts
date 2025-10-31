import { DynamicModule, Module } from '@nestjs/common';
import { LoggingProviderCoreModule } from './logging-provider-core.module';
import { LoggingProviderAsyncOptions, WinstonOptions } from './interfaces';

@Module({})
export class LoggingProviderModule {
    public static forRoot(options: WinstonOptions): DynamicModule {
        return {
            module: LoggingProviderModule,
            imports: [LoggingProviderCoreModule.forRoot(options)],
        };
    }

    public static forRootAsync(options: LoggingProviderAsyncOptions): DynamicModule {
        return {
            module: LoggingProviderModule,
            imports: [LoggingProviderCoreModule.forRootAsync(options)],
        };
    }
}