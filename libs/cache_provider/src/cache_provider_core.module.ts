import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import {
  CacheProviderAsyncOptions,
  CacheProviderOptions,
} from './interfaces';
import {
  CACHE_PROVIDER_MODULE_TOKEN,
  CACHE_PROVIDER_TOKEN,
  MEMCACHED_CLIENT_TOKEN,
} from './constants';
import { getMemcachedClient } from './providers';
import {
  MemcachedService,
  CacheOperationWrapper
} from './services';

@Global()
@Module({})
export class CacheProviderCoreModule {
  private static readonly commonProviders: Provider[] = [
    {
      provide: CACHE_PROVIDER_TOKEN,
      useClass: MemcachedService,
    },
    MemcachedService,
    CacheOperationWrapper,
  ];

  private static readonly commonExports = [
    CACHE_PROVIDER_TOKEN,
    MEMCACHED_CLIENT_TOKEN,
    MemcachedService,
    CacheOperationWrapper,
  ];

  public static forRoot(options: CacheProviderOptions): DynamicModule {
    return {
      module: CacheProviderCoreModule,
      providers: [
        {
          provide: MEMCACHED_CLIENT_TOKEN,
          useValue: getMemcachedClient({ host: options.host }),
        },
        ...this.commonProviders,
      ],
      exports: this.commonExports,
    };
  }

  public static forRootAsync(options: CacheProviderAsyncOptions): DynamicModule {
    return {
      module: CacheProviderCoreModule,
      imports: [
        ...(options.imports || []),
      ],
      providers: [
        this.createAsyncProviders(options)[0],
        {
          provide: MEMCACHED_CLIENT_TOKEN,
          inject: [CACHE_PROVIDER_MODULE_TOKEN],
          useFactory: (cacheOptions: CacheProviderOptions) =>
            getMemcachedClient({ host: cacheOptions.host }),
        },
        ...this.commonProviders,
      ],
      exports: this.commonExports,
    };
  }

  private static createAsyncProviders(options: CacheProviderAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [{
        provide: CACHE_PROVIDER_MODULE_TOKEN,
        useFactory: options.useFactory,
        inject: (options.inject as any[]) || [],
      }];
    }

    if (options.useClass) {
      return [{
        provide: CACHE_PROVIDER_MODULE_TOKEN,
        useClass: options.useClass,
      }];
    }

    if (options.useExisting) {
      return [{
        provide: CACHE_PROVIDER_MODULE_TOKEN,
        useExisting: options.useExisting,
      }];
    }

    throw new Error('Must provide useFactory, useClass, or useExisting');
  }
}
