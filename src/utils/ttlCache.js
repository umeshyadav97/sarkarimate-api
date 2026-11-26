/**
 * Small process-local cache for read responses in warm serverless instances.
 * Entries expire after their TTL and the oldest entry is evicted at capacity.
 * In-flight loaders are shared so concurrent misses do not stampede MongoDB.
 */
const createTtlCache = ({ maxEntries = 100, now = Date.now } = {}) => {
    if (!Number.isInteger(maxEntries) || maxEntries <= 0) {
        throw new RangeError("maxEntries must be a positive integer");
    }
    if (typeof now !== "function") {
        throw new TypeError("now must be a function");
    }

    const entries = new Map();

    const removeExpired = (key) => {
        const entry = entries.get(key);
        if (entry && entry.expiresAt <= now()) {
            entries.delete(key);
            return undefined;
        }
        return entry;
    };

    const getOrLoad = async (key, loader, ttlMs) => {
        if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
            throw new RangeError("ttlMs must be a finite positive number");
        }
        if (typeof loader !== "function") {
            throw new TypeError("loader must be a function");
        }

        const existing = removeExpired(key);
        if (existing) {
            entries.delete(key);
            entries.set(key, existing);
            return existing.promise || existing.value;
        }

        const entry = { expiresAt: Infinity, promise: null, value: undefined };
        const promise = Promise.resolve().then(loader);
        entry.promise = promise;
        entries.set(key, entry);

        while (entries.size > maxEntries) {
            entries.delete(entries.keys().next().value);
        }

        try {
            const value = await promise;
            if (entries.get(key) === entry) {
                entry.value = value;
                entry.promise = null;
                entry.expiresAt = now() + ttlMs;
            }
            return value;
        } catch (error) {
            if (entries.get(key) === entry) entries.delete(key);
            throw error;
        }
    };

    return { getOrLoad, clear: () => entries.clear() };
};

module.exports = createTtlCache;
