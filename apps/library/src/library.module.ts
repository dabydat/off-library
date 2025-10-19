import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { configValidation } from './config/config-validation';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: `apps/library/.env`,
      validationSchema: configValidation,
    }),
    // DatabaseModule,
    BookModule,
  ],
})
export class LibraryModule { }
