// Simple in-memory rate limiter
const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = requests.get(key);

    if (!entry || now > entry.resetAt) {
        requests.set(key, { count: 1, resetAt: now + windowMs });
        return true; // allowed
    }

    if (entry.count >= limit) return false; // blocked

    entry.count++;
    return true; // allowed
}

// Clean up old entries every 5 minutes
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        requests.forEach((v, k) => { if (now > v.resetAt) requests.delete(k); });
    }, 5 * 60 * 1000);
}
