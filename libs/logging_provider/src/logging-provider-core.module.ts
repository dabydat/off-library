import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { LoggingProviderAsyncOptions, WinstonOptions, LoggingProviderOptionsFactory } from './interfaces';
import { WINSTON_LOGGER_TOKEN, LOGGING_PROVIDER_OPTIONS_TOKEN, LOGGING_PROVIDER_PORT } from './constants';
import { LoggingProviderService } from './services';
import { LoggerFactory } from './factories';

@Global()
@Module({})
export class LoggingProviderCoreModule {
    public static forRoot(options: WinstonOptions): DynamicModule {
        const logger = LoggerFactory.createLogger(options);

        const provider: Provider = {
            provide: WINSTON_LOGGER_TOKEN,
            useValue: logger,
        };

        return {
            module: LoggingProviderCoreModule,
            providers: [
                provider,
                LoggingProviderService,
                {
                    provide: LOGGING_PROVIDER_PORT,
                    useClass: LoggingProviderService,
                },
            ],
            exports: [WINSTON_LOGGER_TOKEN, LoggingProviderService, LOGGING_PROVIDER_PORT],
        };
    }

    public static forRootAsync(options: LoggingProviderAsyncOptions): DynamicModule {
        if (!options.useFactory && !options.useClass && !options.useExisting) {
            throw new Error('useFactory, useClass or useExisting is required for forRootAsync');
        }

        const asyncOptionsProvider: Provider = this.createAsyncOptionsProvider(options);

        const loggerProvider: Provider = {
            provide: WINSTON_LOGGER_TOKEN,
            inject: [LOGGING_PROVIDER_OPTIONS_TOKEN],
            useFactory: (winstonOptions: WinstonOptions) => {
                return LoggerFactory.createLogger(winstonOptions);
            },
        };

        return {
            module: LoggingProviderCoreModule,
            imports: [...(options.imports ?? [])],
            providers: [
                asyncOptionsProvider,
                loggerProvider,
                ...this.createAsyncProviders(options),
                LoggingProviderService,
                {
                    provide: LOGGING_PROVIDER_PORT,
                    useClass: LoggingProviderService,
                },
            ],
            exports: [WINSTON_LOGGER_TOKEN, LoggingProviderService, LOGGING_PROVIDER_PORT],
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