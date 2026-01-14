import type { RateLimitStore } from "./types"

const getRateLimitStore = (): RateLimitStore => {
    const globalForRateLimit = globalThis as unknown as { __climatchRateLimit?: RateLimitStore }
    if (!globalForRateLimit.__climatchRateLimit) {
        globalForRateLimit.__climatchRateLimit = new Map()
    }
    return globalForRateLimit.__climatchRateLimit
}

export const checkRateLimit = (key: string, limit: number, windowMs: number) => {
    const store = getRateLimitStore()
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs })
        return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
    }

    if (entry.count >= limit) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt }
    }

    entry.count += 1
    store.set(key, entry)
    return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

export const getClientIp = (request: Request) => {
    const forwardedFor = request.headers.get("x-forwarded-for")
    if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown"
    return request.headers.get("x-real-ip") || "unknown"
}
