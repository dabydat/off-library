export interface CacheProviderOptions {
  /**
   * Memcached server host with port (e.g., "localhost:11211")
   */
  readonly host: string;
}

export interface CacheProviderOptionsFactory {
  createCacheProviderOptions():
    | Promise<CacheProviderOptions>
    | CacheProviderOptions;
}
