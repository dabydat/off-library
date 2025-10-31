import { ModuleMetadata, Type } from '@nestjs/common';
import {
  CacheProviderOptions,
  CacheProviderOptionsFactory,
} from './cache-provider-options';

export interface CacheProviderAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Dependencies that will be injected into the factory or class.
   */
  inject?: readonly any[];

  /**
   * Class that will be instantiated to create options.
   */
  useClass?: Type<CacheProviderOptionsFactory>;

  /**
   * Existing class to use instead of creating a new instance.
   */
  useExisting?: Type<CacheProviderOptionsFactory>;

  /**
   * Factory function that returns CacheProviderOptions or a Promise thereof.
   */
  useFactory?: (...args: any[]) => CacheProviderOptions | Promise<CacheProviderOptions>;
}
