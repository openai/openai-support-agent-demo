const test = require('node:test');
const assert = require('assert');
const Redis = require('ioredis');

const url =
  process.env.REDIS_URL ||
  (process.env.REDIS_PORT
    ? `redis://localhost:${process.env.REDIS_PORT}`
    : 'redis://localhost:6379');

test('Redis responds to ping', async (t: any) => {
  const redis = new Redis(url);
  try {
    const res = await redis.ping();
    assert.strictEqual(res, 'PONG');
  } catch {
    t.skip('Redis not running');
  } finally {
    redis.disconnect();
  }
});

