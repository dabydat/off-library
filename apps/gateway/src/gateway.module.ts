import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import configEnvironment from './config';
import { configValidation } from './config/config-validation';
import { LibraryMsModule } from './library-ms/library-ms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configEnvironment],
      envFilePath: `apps/gateway/.env`,
      validationSchema: configValidation,
    }),
    LibraryMsModule
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule { }
