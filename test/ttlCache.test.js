const test = require("node:test");
const assert = require("node:assert/strict");
const createTtlCache = require("../src/utils/ttlCache");

test("loads a key once during its TTL and shares concurrent work", async () => {
    let loads = 0;
    const cache = createTtlCache();
    let finish;
    const loader = () => {
        loads += 1;
        return new Promise((resolve) => { finish = resolve; });
    };

    const first = cache.getOrLoad("home", loader, 1000);
    const second = cache.getOrLoad("home", loader, 1000);
    await Promise.resolve();
    assert.equal(loads, 1);
    finish({ jobs: [] });
    assert.deepEqual(await first, { jobs: [] });
    assert.deepEqual(await second, { jobs: [] });
    assert.deepEqual(await cache.getOrLoad("home", loader, 1000), { jobs: [] });
    assert.equal(loads, 1);
});

test("expires entries and clear invalidates cached values", async () => {
    let time = 0;
    let loads = 0;
    const cache = createTtlCache({ now: () => time });
    const loader = async () => ++loads;

    assert.equal(await cache.getOrLoad("key", loader, 50), 1);
    time = 51;
    assert.equal(await cache.getOrLoad("key", loader, 50), 2);
    cache.clear();
    assert.equal(await cache.getOrLoad("key", loader, 50), 3);
});

test("does not cache a failed loader and allows a later retry", async () => {
    const cache = createTtlCache();
    let attempts = 0;
    const loader = async () => {
        attempts += 1;
        if (attempts === 1) throw new Error("temporary failure");
        return "recovered";
    };

    await assert.rejects(cache.getOrLoad("retry", loader, 1000), /temporary failure/);
    assert.equal(await cache.getOrLoad("retry", loader, 1000), "recovered");
    assert.equal(attempts, 2);
});

test("clearing during a load prevents that result from repopulating the cache", async () => {
    const cache = createTtlCache();
    let finishFirst;
    let loads = 0;
    const firstLoader = () => {
        loads += 1;
        return new Promise((resolve) => { finishFirst = resolve; });
    };

    const first = cache.getOrLoad("home", firstLoader, 1000);
    await Promise.resolve();
    cache.clear();
    finishFirst("old");
    assert.equal(await first, "old");

    const fresh = await cache.getOrLoad("home", async () => {
        loads += 1;
        return "fresh";
    }, 1000);
    assert.equal(fresh, "fresh");
    assert.equal(loads, 2);
});

test("rejects invalid capacity and TTL values", async () => {
    for (const maxEntries of [0, -1, 1.5, NaN, Infinity]) {
        assert.throws(() => createTtlCache({ maxEntries }), RangeError);
    }

    const cache = createTtlCache();
    for (const ttlMs of [0, -1, NaN, Infinity, -Infinity]) {
        await assert.rejects(cache.getOrLoad("key", async () => "value", ttlMs), RangeError);
    }
});

test("evicts the least recently used key when capacity is reached", async () => {
    let loads = 0;
    const cache = createTtlCache({ maxEntries: 2 });
    const loader = async () => ++loads;

    await cache.getOrLoad("a", loader, 1000);
    await cache.getOrLoad("b", loader, 1000);
    await cache.getOrLoad("a", loader, 1000);
    await cache.getOrLoad("c", loader, 1000);
    assert.equal(await cache.getOrLoad("b", loader, 1000), 4);
});
