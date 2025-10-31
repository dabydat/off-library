export interface GetCacheRequest {
  key: string;
}

export interface SetCacheRequest {
  key: string;
  value: string | number | boolean | object;
  ttl?: number; // Time to live in seconds
}

export interface DeleteCacheRequest {
  key: string;
}

export interface IncrementCacheRequest {
  key: string;
  value: number;
}

export interface DecrementCacheRequest {
  key: string;
  value: number;
}
