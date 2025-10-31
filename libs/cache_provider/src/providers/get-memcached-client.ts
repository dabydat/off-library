import Memcached = require('memcached');
import { strict as assert } from 'assert';

interface MemcachedClientProps {
  host: string; // Format: "localhost:11211"
}

const DEFAULT_MEMCACHED_CONFIG = {
  timeout: 1000,
  retries: 1,
  retry: 1000,
  remove: true,
  maxKeySize: 250,
  maxExpiration: 2592000,
  maxValue: 1048576,
  poolSize: 10,
  algorithm: 'md5',
  reconnect: 18000000,
  keyCompression: false,
  idle: 5000,
} as const;

export function getMemcachedClient({ host }: MemcachedClientProps): Memcached {
  assert(host, 'The memcached host property must be defined');
  assert(host.includes(':'), 'The memcached host must include port (e.g., "localhost:11211")');

  return new Memcached(host, DEFAULT_MEMCACHED_CONFIG);
}
