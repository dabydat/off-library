import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FactusAsyncOptions, FactusOptions, FactusOptionsFactory } from './interfaces';
import { FACTUS_TOKEN } from './constants';
import { ApiService } from './services/api.service';
import { TokenService } from './services/token.service';
import { MunicipalitiesService } from './services/municipalities.service';

@Global()
@Module({})
export class FactusCoreModule {
  public static forRoot(options: FactusOptions): DynamicModule {
    return {
      module: FactusCoreModule,
      providers: [
        {
          provide: FACTUS_TOKEN,
          useValue: options,
        },
        TokenService,
        ApiService,
        MunicipalitiesService
      ],
      exports: [ApiService, MunicipalitiesService],
      imports: [HttpModule.register({})],
    };
  }

  public static forRootAsync(options: FactusAsyncOptions): DynamicModule {
    if (!options.useFactory) {
      throw new Error('useFactory is required for forRootAsync');
    }

    return {
      module: FactusCoreModule,
      imports: [...(options.imports ?? []), HttpModule.register({})],
      providers: [
        {
          inject: [...(options.inject || [])],
          provide: FACTUS_TOKEN,
          useFactory: options.useFactory,
        },
        ...this.createAsyncProviders(options),
        TokenService,
        ApiService,
        MunicipalitiesService
      ],
      exports: [ApiService,
        MunicipalitiesService
      ],
    };
  }

  private static createAsyncProviders(options: FactusAsyncOptions): Provider[] {
    if (!options.useExisting && !options.useFactory && !options.useClass) {
      throw new Error('Invalid configuration. You must provide useFactory, useClass or useExisting');
    }

    const providers: Provider[] = [this.createAsyncOptionsProvider(options)];

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return providers;
  }

  private static createAsyncOptionsProvider(options: FactusAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: FACTUS_TOKEN,
        useFactory: options.useFactory,
        inject: [...(options.inject || [])],
      };
    }

    const injectClass = options.useExisting || options.useClass;
    if (!injectClass) {
      throw new Error('Invalid configuration. You must provide useFactory, useClass or useExisting');
    }

    return {
      provide: FACTUS_TOKEN,
      inject: [injectClass],
      useFactory: (optionsFactory: FactusOptionsFactory) =>
        optionsFactory.createFactusOptions(),
    };
  }
}