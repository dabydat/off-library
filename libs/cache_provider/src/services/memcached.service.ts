import { Injectable, Inject } from '@nestjs/common';
import Memcached = require('memcached');
import { MEMCACHED_CLIENT_TOKEN } from '../constants';
import { GetCacheRequest, GetCacheResponse, SetCacheRequest, SetCacheResponse, DeleteCacheRequest, DeleteCacheResponse, IncrementCacheRequest, IncrementCacheResponse, DecrementCacheRequest, DecrementCacheResponse, FlushCacheResponse } from '@app/cache_provider/interfaces';
import { CacheOperationWrapper } from './cache-operation-wrapper.service';
import { CacheProviderPort } from '../interfaces/services/cache-provider.port';
import { LOGGING_PROVIDER_TOKEN, type LoggingProviderPort } from '@app/logging_provider';

@Injectable()
export class MemcachedService implements CacheProviderPort {
  constructor(
    @Inject(MEMCACHED_CLIENT_TOKEN) private readonly memcachedClient: Memcached,
    private readonly operationWrapper: CacheOperationWrapper,
    @Inject(LOGGING_PROVIDER_TOKEN) private readonly logger: LoggingProviderPort
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

  async getMulti(keys: string[]): Promise<Record<string, any>> {
    if (!keys || keys.length === 0) {
      return {};
    }

    // Validar todas las keys antes de la operación
    for (const key of keys) {
      this.operationWrapper['validateKey'](key);
    }

    return new Promise((resolve, reject) => {
      this.memcachedClient.getMulti(keys, (err, data) => {
        if (err) {
          this.logger.error('getMulti failed', { keys, error: err.message });
          return reject(err);
        }

        this.logger.info('getMulti completed', {
          requestedKeys: keys.length,
          foundKeys: Object.keys(data || {}).length
        });

        resolve(data || {});
      });
    });
  }

  async setMulti(items: Array<{ key: string; value: any; ttl?: number }>): Promise<{ success: boolean }> {
    if (!items || items.length === 0) {
      return { success: true };
    }

    try {
      const promises = items.map(item =>
        this.set({
          key: item.key,
          value: item.value,
          ttl: item.ttl
        })
      );

      await Promise.all(promises);

      this.logger.info('setMulti completed', { itemsCount: items.length });
      return { success: true };
    } catch (error) {
      this.logger.error('setMulti failed', {
        itemsCount: items.length,
        error: error.message
      });
      throw error;
    }
  }
}