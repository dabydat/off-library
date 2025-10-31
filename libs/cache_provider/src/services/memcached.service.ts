import { Injectable } from '@nestjs/common';
import Memcached = require('memcached');
import { InjectMemcached } from '../decorators';
import { CacheProvider } from '../interfaces/services/cache.provider';
import { GetCacheRequest, GetCacheResponse, SetCacheRequest, SetCacheResponse, DeleteCacheRequest, DeleteCacheResponse, IncrementCacheRequest, IncrementCacheResponse, DecrementCacheRequest, DecrementCacheResponse, FlushCacheResponse } from '@app/cache_provider/interfaces';
import { CacheOperationWrapper } from './cache-operation-wrapper.service';
import { LoggingProviderService } from '../../../logging_provider/src';

@Injectable()
export class MemcachedService implements CacheProvider {
  constructor(
    @InjectMemcached() private readonly memcachedClient: Memcached,
    private readonly operationWrapper: CacheOperationWrapper,
    private readonly logger: LoggingProviderService
  ) { }

  async get(request: GetCacheRequest): Promise<GetCacheResponse> {
    return this.operationWrapper.execute('get', request.key, () =>
      new Promise((resolve, reject) => {
        this.memcachedClient.get(request.key, (err, data) => {
          if (err) return reject(err);

          const exists = data !== undefined && data !== null;
          this.logger.info(`Cache GET result`, { key: request.key, exists, dataType: typeof data });

          resolve({
            value: data,
            exists,
          });
        });
      })
    );
  }

  async set(request: SetCacheRequest): Promise<SetCacheResponse> {
    return this.operationWrapper.execute('set', request.key, () =>
      new Promise((resolve, reject) => {
        this.memcachedClient.set(
          request.key,
          request.value,
          request.ttl || 0,
          (err) => err ? reject(err) : resolve({ success: true })
        );
      })
    );
  }

  async delete(request: DeleteCacheRequest): Promise<DeleteCacheResponse> {
    return this.operationWrapper.execute('delete', request.key, () =>
      new Promise((resolve, reject) => {
        this.memcachedClient.del(request.key, (err) =>
          err ? reject(err) : resolve({ success: true })
        );
      })
    );
  }

  async increment(request: IncrementCacheRequest): Promise<IncrementCacheResponse> {
    return this.operationWrapper.execute('increment', request.key, () =>
      new Promise((resolve, reject) => {
        this.memcachedClient.incr(request.key, request.value, (err, value) => {
          if (err) return reject(err);
          resolve({
            value: typeof value === 'number' ? value : 0,
            success: true,
          });
        });
      })
    );
  }

  async decrement(request: DecrementCacheRequest): Promise<DecrementCacheResponse> {
    return this.operationWrapper.execute('decrement', request.key, () =>
      new Promise((resolve, reject) => {
        this.memcachedClient.decr(request.key, request.value, (err, value) => {
          if (err) return reject(err);
          resolve({
            value: typeof value === 'number' ? value : 0,
            success: true,
          });
        });
      })
    );
  }

  async flush(): Promise<FlushCacheResponse> {
    return this.operationWrapper.execute('flush', undefined, () =>
      new Promise((resolve, reject) => {
        this.memcachedClient.flush((err) =>
          err ? reject(err) : resolve({ success: true })
        );
      })
    );
  }
}