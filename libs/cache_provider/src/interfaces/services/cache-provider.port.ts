import { GetCacheRequest, GetCacheResponse, SetCacheRequest, SetCacheResponse, DeleteCacheRequest, DeleteCacheResponse, IncrementCacheRequest, IncrementCacheResponse, DecrementCacheRequest, DecrementCacheResponse, FlushCacheResponse } from '@app/cache_provider/interfaces';

export interface CacheProviderPort {
  get(request: GetCacheRequest): Promise<GetCacheResponse>;
  set(request: SetCacheRequest): Promise<SetCacheResponse>;
  delete(request: DeleteCacheRequest): Promise<DeleteCacheResponse>;
  increment(request: IncrementCacheRequest): Promise<IncrementCacheResponse>;
  decrement(request: DecrementCacheRequest): Promise<DecrementCacheResponse>;
  flush(): Promise<FlushCacheResponse>;
}
