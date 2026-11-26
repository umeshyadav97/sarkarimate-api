# Read cache behavior

The jobs home response and shared five-item listing previews use an in-memory
cache with a three-minute TTL. It is bounded to 100 entries per Node process,
and concurrent requests for the same uncached key share one loader promise.

On a successful job create, update, or soft delete, the current process clears
all cached home and preview entries. A Vercel deployment may serve requests from
multiple independent function instances, so a write cannot clear another
instance's memory. Those entries expire within three minutes; no shared cache
service or cross-instance invalidation is used. Failed writes do not invalidate
the cache.
