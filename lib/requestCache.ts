import type { CacheStore } from "./types"

const getCacheStore = (): CacheStore => {
    const globalForCache = globalThis as unknown as { __climatchCache?: CacheStore }
    if (!globalForCache.__climatchCache) {
        globalForCache.__climatchCache = new Map()
    }
    return globalForCache.__climatchCache
}

export const getCachedValue = <T>(key: string): T | null => {
    const store = getCacheStore()
    const entry = store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
        store.delete(key)
        return null
    }
    return entry.value as T
}

export const setCachedValue = <T>(key: string, value: T, ttlMs: number) => {
    const store = getCacheStore()
    store.set(key, { value, expiresAt: Date.now() + ttlMs })
}
