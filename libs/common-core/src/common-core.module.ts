import { Module } from '@nestjs/common';
import { CommonCoreService } from './common-core.service';

@Module({
  providers: [CommonCoreService],
  exports: [CommonCoreService],
})
export class CommonCoreModule {}
