import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { FactusOptionsFactory } from './factus-options-factory';
import { FactusOptions } from './factus-options';

export interface FactusAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Dependencies that will be injected into the factory or class.
   */
  inject?: readonly any[];

  /**
   * Class that will be instantiated to create options.
   */
  useClass?: Type<FactusOptionsFactory>;

  /**
   * Existing class to use instead of creating a new instance.
   */
  useExisting?: Type<FactusOptionsFactory>;

  /**
   * Factory function that returns FactusOptions or a Promise thereof.
   */
  useFactory?: (...args: any[]) => FactusOptions | Promise<FactusOptions>;
}
