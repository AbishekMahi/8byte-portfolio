// cache.ts
// saves API result in memory for 15 seconds
// so we dont hit yahoo again and again on every browser refresh

type CacheItem = { data: unknown; expiresAt: number };

const memoryStore = new Map<string, CacheItem>();

export function getCachedData<T>(key: string): T | null {
  const item = memoryStore.get(key);
  if (!item) return null;

  // expired? delete and return nothing
  if (Date.now() > item.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return item.data as T;
}

export function saveToCache(key: string, data: unknown, ttlMs: number) {
  memoryStore.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function removeFromCache(key: string) {
  // used when user hits ?refresh=true - force fresh yahoo calls
  memoryStore.delete(key);
}
