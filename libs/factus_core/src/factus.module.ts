import { DynamicModule, Module } from '@nestjs/common';
import { FactusAsyncOptions, FactusOptions } from './interfaces';
import { FactusCoreModule } from './factus_core.module';

@Module({})
export class FactusModule {
    public static forRoot(options: FactusOptions): DynamicModule {
        return {
            module: FactusCoreModule,
            imports: [FactusCoreModule.forRoot(options)],
        };
    }

    public static forRootAsync(options: FactusAsyncOptions): DynamicModule {
        return {
            module: FactusCoreModule,
            imports: [FactusCoreModule.forRootAsync(options)],
        };
    }
}
