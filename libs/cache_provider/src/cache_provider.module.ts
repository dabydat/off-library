import { DynamicModule, Module } from '@nestjs/common';
import { CacheProviderAsyncOptions, CacheProviderOptions } from './interfaces';
import { CacheProviderCoreModule } from './cache_provider_core.module';

@Module({})
export class CacheProviderModule {
  public static forRoot(options: CacheProviderOptions): DynamicModule {
    return {
      module: CacheProviderCoreModule,
      imports: [CacheProviderCoreModule.forRoot(options)],
    };
  }

  public static forRootAsync(
    options: CacheProviderAsyncOptions,
  ): DynamicModule {
    return {
      module: CacheProviderCoreModule,
      imports: [CacheProviderCoreModule.forRootAsync(options)],
    };
  }
}
