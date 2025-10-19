import { Test, TestingModule } from '@nestjs/testing';
import { CommonCoreService } from './common-core.service';

describe('CommonCoreService', () => {
  let service: CommonCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonCoreService],
    }).compile();

    service = module.get<CommonCoreService>(CommonCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
