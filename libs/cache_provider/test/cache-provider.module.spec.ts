import { Test, TestingModule } from '@nestjs/testing';
import { CacheProviderModule } from '../src/cache_provider.module';
import { CACHE_PROVIDER_TOKEN } from '../src/constants';
import { mockCacheProviderOptions } from './cache-provider-options';

describe('CacheProviderModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CacheProviderModule.forRoot(mockCacheProviderOptions)],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide cache provider services', () => {
    const cacheProvider = module.get(CACHE_PROVIDER_TOKEN);
    expect(cacheProvider).toBeDefined();
  });
});
