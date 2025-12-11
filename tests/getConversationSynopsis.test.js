const assert = require('assert');
const { test, mock } = require('node:test');
require('ts-node/register/transpile-only');
require('../scripts/register-tsconfig-paths.js');

const { toResponseMessage } = require('../lib/utils/toResponseMessage.ts');
const { getConversationSynopsis } = require('../lib/getConversationSynopsis.ts');
const conversationHistory = require('../lib/getConversationHistory.ts');
const redis = require('../lib/redis.ts').default;
const prisma = require('../lib/prisma.ts').default;

test('getConversationSynopsis summarizes history and caches results', async (t) => {
  const cache = new Map();
  const originalGet = redis.get;
  const originalSet = redis.set;
  redis.get = async (key) => cache.get(key) ?? null;
  redis.set = async (key, value) => {
    cache.set(key, value);
    return 'OK';
  };
  t.after(async () => {
    redis.get = originalGet;
    redis.set = originalSet;
    if (typeof redis.disconnect === 'function') {
      await redis.disconnect();
    }
    await prisma.$disconnect();
  });

  const sampleHistory = [
    toResponseMessage('user', 'First question about billing details and costs'),
    toResponseMessage('assistant', 'Provided clarification on billing setup'),
    toResponseMessage('user', 'Follow-up asking about delivery timeline tomorrow morning'),
  ];

  const historyMock = mock.method(
    conversationHistory,
    'getConversationHistory',
    async () => sampleHistory
  );
  t.after(() => {
    historyMock.mock.restore();
  });

  const summaryOne = await getConversationSynopsis('chatwoot:test', {
    latestMessageId: 10,
  });
  assert.ok(summaryOne);
  assert.ok(summaryOne.includes('Conversation synopsis'));
  assert.ok(summaryOne.includes('Latest turn'));
  assert.strictEqual(historyMock.mock.calls.length, 1);

  const summaryTwo = await getConversationSynopsis('chatwoot:test', {
    latestMessageId: 10,
  });
  assert.strictEqual(summaryTwo, summaryOne);
  assert.strictEqual(historyMock.mock.calls.length, 1);

  const cachedPayload = cache.get('synopsis:chatwoot:test:10');
  assert.ok(typeof cachedPayload === 'string');

  const summaryThree = await getConversationSynopsis('chatwoot:test', {
    latestMessageId: 11,
  });
  assert.ok(summaryThree);
  assert.strictEqual(historyMock.mock.calls.length, 2);
});
