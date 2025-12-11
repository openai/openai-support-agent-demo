const assert = require('assert');
const { test, mock } = require('node:test');
require('ts-node/register/transpile-only');
require('../scripts/register-tsconfig-paths.js');

const {
  scheduleProviderCall,
  setLimiterConfigForTesting,
  resetLimiterForTesting,
  setLimiterObserver,
} = require('../lib/providers/limiter.ts');

async function waitForCondition(predicate, attempts = 50, stepMs = 0) {
  for (let i = 0; i < attempts; i += 1) {
    if (predicate()) {
      return true;
    }
    mock.timers.tick(stepMs);
    await Promise.resolve();
  }
  return predicate();
}

test('limiter enforces concurrency per provider', async () => {
  resetLimiterForTesting();
  setLimiterConfigForTesting({
    openai: {
      concurrency: 1,
      tokensPerInterval: 1000,
      intervalMs: 1000,
      maxTokens: 1000,
    },
  });

  mock.timers.enable({ now: 0 });
  try {
    const events = [];
    setLimiterObserver((event) => {
      events.push(event);
    });
    const startOrder = [];

    const launchJob = (id) =>
      scheduleProviderCall('openai', { input: 10, output: 0 }, async () => {
        startOrder.push({ id, time: Date.now() });
        await new Promise((resolve) => setTimeout(resolve, 50));
        return (async function* () {
          yield id;
        })();
      });

    const firstStreamPromise = launchJob('first');
    const secondStreamPromise = launchJob('second');

    await waitForCondition(() => startOrder.length >= 1);
    assert.strictEqual(startOrder.length, 1);
    assert.strictEqual(startOrder[0].id, 'first');

    mock.timers.tick(50);
    const firstStream = await firstStreamPromise;
    const firstValues = [];
    for await (const value of firstStream) {
      firstValues.push(value);
    }
    assert.deepStrictEqual(firstValues, ['first']);

    await waitForCondition(() => startOrder.length >= 2);
    assert.strictEqual(startOrder[1].id, 'second');
    assert.ok(startOrder[1].time >= 50);

    mock.timers.tick(50);
    const secondStream = await secondStreamPromise;
    const secondValues = [];
    for await (const value of secondStream) {
      secondValues.push(value);
    }
    assert.deepStrictEqual(secondValues, ['second']);

    const enqueuedEvents = events.filter((event) => event.type === 'enqueued');
    assert.strictEqual(enqueuedEvents.length, 2);
    assert.strictEqual(enqueuedEvents[0].queueLength, 1);
    assert.strictEqual(enqueuedEvents[1].queueLength, 1);

    const startedEvents = events.filter((event) => event.type === 'started');
    assert.strictEqual(startedEvents.length, 2);
    assert.strictEqual(startedEvents[0].queueLength, 0);
    assert.strictEqual(startedEvents[0].waitMs, 0);
    assert.strictEqual(startedEvents[1].queueLength, 0);
    assert.ok(startedEvents[1].waitMs >= 50);

    const completedEvents = events.filter((event) => event.type === 'completed');
    assert.strictEqual(completedEvents.length, 2);
    assert.ok(completedEvents.every((event) => event.error === false));
  } finally {
    mock.timers.reset();
    setLimiterObserver(undefined);
    resetLimiterForTesting();
  }
});

test('limiter enforces token bucket delays', async () => {
  resetLimiterForTesting();
  setLimiterConfigForTesting({
    openai: {
      concurrency: 4,
      tokensPerInterval: 50,
      intervalMs: 1000,
      maxTokens: 50,
    },
  });

  mock.timers.enable({ now: 0 });
  try {
    const events = [];
    setLimiterObserver((event) => {
      events.push(event);
    });
    const startOrder = [];

    const launchJob = (id) =>
      scheduleProviderCall('openai', { input: 40, output: 0 }, async () => {
        startOrder.push({ id, time: Date.now() });
        return (async function* () {
          yield id;
        })();
      });

    const firstStreamPromise = launchJob('first');
    const secondStreamPromise = launchJob('second');

    await waitForCondition(() => startOrder.length >= 1);
    assert.strictEqual(startOrder.length, 1);

    const firstStream = await firstStreamPromise;
    const firstValues = [];
    for await (const value of firstStream) {
      firstValues.push(value);
    }
    assert.deepStrictEqual(firstValues, ['first']);

    assert.strictEqual(startOrder.length, 1);

    mock.timers.tick(1000);
    mock.timers.tick(0);
    await waitForCondition(() => startOrder.length >= 2, 100);

    assert.strictEqual(startOrder.length, 2);
    assert.ok(startOrder[1].time >= 1000);

    const secondStream = await secondStreamPromise;
    const secondValues = [];
    for await (const value of secondStream) {
      secondValues.push(value);
    }
    assert.deepStrictEqual(secondValues, ['second']);

    const throttledEvents = events.filter((event) => event.type === 'throttled');
    assert.ok(throttledEvents.length >= 1);
    assert.strictEqual(throttledEvents[0].queueLength, 1);
    assert.ok(throttledEvents[0].waitMs >= 0);
    assert.ok(throttledEvents[0].delayMs >= 500);

    const startedEvents = events.filter((event) => event.type === 'started');
    assert.strictEqual(startedEvents.length, 2);
    assert.ok(startedEvents[1].waitMs >= 1000);
  } finally {
    mock.timers.reset();
    setLimiterObserver(undefined);
    resetLimiterForTesting();
  }
});

test('limiter eventually runs long-waiting jobs to avoid starvation', async () => {
  resetLimiterForTesting();
  setLimiterConfigForTesting({
    openai: {
      concurrency: 1,
      tokensPerInterval: 10,
      intervalMs: 100,
      maxTokens: 10,
    },
  });

  mock.timers.enable({ now: 0 });
  try {
    const startOrder = [];

    const launchJob = (id, tokens) =>
      scheduleProviderCall('openai', { input: tokens }, async () => {
        startOrder.push({ id, time: Date.now() });
        return 'done';
      });

    const completions = [];
    completions.push(launchJob('small-0', 5));
    await waitForCondition(() => startOrder.length >= 1);
    assert.strictEqual(startOrder[0].id, 'small-0');

    const largePromise = launchJob('large', 9);
    completions.push(largePromise);

    for (let i = 1; i <= 5; i += 1) {
      completions.push(launchJob(`small-${i}`, 3));
    }

    await waitForCondition(() => startOrder.length >= 2, 50, 10);
    assert.strictEqual(
      startOrder.some((entry) => entry.id === 'large'),
      false
    );

    await waitForCondition(
      () => startOrder.some((entry) => entry.id === 'large'),
      200,
      10
    );

    const largeEntry = startOrder.find((entry) => entry.id === 'large');
    assert.ok(largeEntry, 'expected large job to start eventually');
    assert.ok(
      largeEntry.time >= 120,
      `expected large job to wait for tokens, saw start at ${largeEntry.time}`
    );

    await waitForCondition(
      () =>
        startOrder.filter((entry) => entry.id.startsWith('small')).length === 6,
      200,
      10
    );
    await Promise.all(completions);
  } finally {
    mock.timers.reset();
    resetLimiterForTesting();
  }
});
