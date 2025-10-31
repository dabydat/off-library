import { Inject } from '@nestjs/common';
import { MEMCACHED_CLIENT_TOKEN } from '../constants';

export function InjectMemcached() {
  return Inject(MEMCACHED_CLIENT_TOKEN);
}
