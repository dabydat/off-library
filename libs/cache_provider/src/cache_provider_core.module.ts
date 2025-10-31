import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import {
  CacheProviderAsyncOptions,
  CacheProviderOptions,
} from './interfaces';
import {
  CACHE_PROVIDER_MODULE_TOKEN,
  MEMCACHED_CLIENT_TOKEN,
  CACHE_PROVIDER_SERVICE_TOKEN,
} from './constants';
import { getMemcachedClient } from './providers';
import {
  MemcachedService,
  CacheOperationWrapper
} from './services';

@Global()
@Module({})
export class CacheProviderCoreModule {
  public static forRoot(options: CacheProviderOptions): DynamicModule {
    return {
      module: CacheProviderCoreModule,
      providers: [
        {
          provide: MEMCACHED_CLIENT_TOKEN,
          useValue: getMemcachedClient({ host: options.host }),
        },
        {
          provide: CACHE_PROVIDER_SERVICE_TOKEN,
          useClass: MemcachedService,
        },
        MemcachedService,
        CacheOperationWrapper,
      ],
      exports: [MEMCACHED_CLIENT_TOKEN, CACHE_PROVIDER_SERVICE_TOKEN],
    };
  }

  public static forRootAsync(options: CacheProviderAsyncOptions): DynamicModule {
    return {
      module: CacheProviderCoreModule,
      imports: [
        ...(options.imports || []),
      ],
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: MEMCACHED_CLIENT_TOKEN,
          inject: [CACHE_PROVIDER_MODULE_TOKEN],
          useFactory: (cacheOptions: CacheProviderOptions) =>
            getMemcachedClient({ host: cacheOptions.host }),
        },
        {
          provide: CACHE_PROVIDER_SERVICE_TOKEN,
          useClass: MemcachedService,
        },
        MemcachedService,
        CacheOperationWrapper,
      ],
      exports: [MEMCACHED_CLIENT_TOKEN, CACHE_PROVIDER_SERVICE_TOKEN],
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
