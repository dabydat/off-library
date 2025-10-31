import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { LoggingProviderAsyncOptions, WinstonOptions, LoggingProviderOptionsFactory } from './interfaces';
import { WINSTON_LOGGER_TOKEN, LOGGING_PROVIDER_OPTIONS_TOKEN, LOGGING_PROVIDER_TOKEN } from './constants';
import { LoggingProviderService } from './services';
import { LoggerFactory } from './factories';

@Global()
@Module({})
export class LoggingProviderCoreModule {
    public static forRoot(options: WinstonOptions): DynamicModule {
        return {
            module: LoggingProviderCoreModule,
            providers: [
                {
                    provide: WINSTON_LOGGER_TOKEN,
                    useValue: LoggerFactory.createLogger(options),
                },
                {
                    provide: LOGGING_PROVIDER_TOKEN,
                    useClass: LoggingProviderService,
                },
            ],
            exports: [WINSTON_LOGGER_TOKEN, LOGGING_PROVIDER_TOKEN],
        };
    }

    public static forRootAsync(options: LoggingProviderAsyncOptions): DynamicModule {
        if (!options.useFactory && !options.useClass && !options.useExisting) {
            throw new Error('useFactory, useClass or useExisting is required for forRootAsync');
        }
        const asyncOptionsProvider: Provider = this.createAsyncOptionsProvider(options);

        return {
            module: LoggingProviderCoreModule,
            imports: [...(options.imports ?? [])],
            providers: [
                asyncOptionsProvider,
                {
                    provide: WINSTON_LOGGER_TOKEN,
                    inject: [LOGGING_PROVIDER_OPTIONS_TOKEN],
                    useFactory: (winstonOptions: WinstonOptions) => {
                        return LoggerFactory.createLogger(winstonOptions);
                    },
                },
                ...this.createAsyncProviders(options),
                {
                    provide: LOGGING_PROVIDER_TOKEN,
                    useClass: LoggingProviderService,
                },
            ],
            exports: [WINSTON_LOGGER_TOKEN, LOGGING_PROVIDER_TOKEN],
        };
    }

    private static createAsyncProviders(options: LoggingProviderAsyncOptions): Provider[] {
        if (!options.useExisting && !options.useFactory && !options.useClass) {
            throw new Error('Invalid configuration. You must provide useFactory, useClass or useExisting');
        }

        const providers: Provider[] = [];

        if (options.useClass) {
            providers.push({
                provide: options.useClass,
                useClass: options.useClass,
            });
        }

        return providers;
    }

    private static createAsyncOptionsProvider(options: LoggingProviderAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: LOGGING_PROVIDER_OPTIONS_TOKEN,
                useFactory: options.useFactory,
                inject: [...(options.inject || [])],
            };
        }

        const injectClass = options.useExisting || options.useClass;
        if (!injectClass) {
            throw new Error('Invalid configuration. You must provide useFactory, useClass or useExisting');
        }

        return {
            provide: LOGGING_PROVIDER_OPTIONS_TOKEN,
            inject: [injectClass],
            useFactory: (optionsFactory: LoggingProviderOptionsFactory) =>
                optionsFactory.createWinstonOptions(),
        };
    }
}