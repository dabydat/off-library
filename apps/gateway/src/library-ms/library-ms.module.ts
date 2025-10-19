import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientConstant } from '@app/common-core/infrastructure/constants/client.constants';
import { LibraryController } from './infrastructure/rest/library.controller';


@Module({
    controllers: [LibraryController],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        ClientsModule.registerAsync([
            {
                name: ClientConstant.LIBRARY_CLIENT,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        port: configService.get<number>('client.library.port'),
                        host: configService.get<string>('client.library.host'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
})
export class LibraryMsModule { }
