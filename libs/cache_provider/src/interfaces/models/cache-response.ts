export interface GetCacheResponse {
  value: string | number | boolean | object | null;
  exists: boolean;
}

export interface SetCacheResponse {
  success: boolean;
}

export interface DeleteCacheResponse {
  success: boolean;
}

export interface IncrementCacheResponse {
  value: number;
  success: boolean;
}

export interface DecrementCacheResponse {
  value: number;
  success: boolean;
}

export interface FlushCacheResponse {
  success: boolean;
}
