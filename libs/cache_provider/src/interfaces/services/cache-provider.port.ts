import { GetCacheRequest, GetCacheResponse, SetCacheRequest, SetCacheResponse, DeleteCacheRequest, DeleteCacheResponse, IncrementCacheRequest, IncrementCacheResponse, DecrementCacheRequest, DecrementCacheResponse, FlushCacheResponse } from '@app/cache_provider/interfaces';

export interface CacheProviderPort {
  /**
   * Obtiene un valor de caché por su key
   * @param request - Objeto con la key a obtener
   * @returns Objeto con el valor y si existe
   */
  get(request: GetCacheRequest): Promise<GetCacheResponse>;

  /**
   * Establece un valor en caché
   * @param request - Objeto con la key y el valor a establecer
   * @returns Objeto con el resultado de la operación
   */
  set(request: SetCacheRequest): Promise<SetCacheResponse>;

  /**
   * Elimina un valor de caché por su key
   * @param request - Objeto con la key a eliminar
   * @returns Objeto con el resultado de la operación
   */
  delete(request: DeleteCacheRequest): Promise<DeleteCacheResponse>;

  /**
   * Incrementa un valor en caché por su key
   * @param request - Objeto con la key y el valor a incrementar
   * @returns Objeto con el resultado de la operación
   */
  increment(request: IncrementCacheRequest): Promise<IncrementCacheResponse>;

  /**
   * Decrementa un valor en caché por su key
   * @param request - Objeto con la key y el valor a decrementar
   * @returns Objeto con el resultado de la operación
   */
  decrement(request: DecrementCacheRequest): Promise<DecrementCacheResponse>;

  /**
   * Limpia toda la caché
   * @returns Objeto con el resultado de la operación
   */
  flush(): Promise<FlushCacheResponse>;

  /**
   * Obtiene múltiples valores de caché en una sola operación
   * @param keys - Array de keys a obtener
   * @returns Record con los valores encontrados
   */
  getMulti(keys: string[]): Promise<Record<string, any>>;

  /**
   * Establece múltiples valores de caché en una sola operación
   * @param items - Array de items con key, value y ttl opcional
   * @returns Promise indicando el éxito de la operación
   */
  setMulti(items: Array<{ key: string; value: any; ttl?: number }>): Promise<{ success: boolean }>;
}
