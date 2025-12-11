const assert = require('assert');
const test = require('node:test');
const crypto = require('crypto');
const { mock } = test;

function clearModule(path) {
  try { delete require.cache[require.resolve(path)]; } catch {}
}

function loadSummarizeText({ redisGet, redisSet, openaiCreate }) {
  clearModule('../lib/redis.ts');
  clearModule('openai');
  clearModule('../lib/server/summarizeText.ts');

  const redisMock = { get: redisGet, set: redisSet };
  require.cache[require.resolve('../lib/redis.ts')] = { exports: redisMock };

  function OpenAI() {
    this.responses = { create: openaiCreate };
  }
  require.cache[require.resolve('openai')] = { exports: OpenAI };

  return require('../lib/server/summarizeText.ts').summarizeText;
}

test('returns cached summary and skips OpenAI on cache hit', async () => {
  const redisGet = mock.fn(async () => 'cached summary');
  const redisSet = mock.fn();
  const openaiCreate = mock.fn();

  const summarizeText = loadSummarizeText({ redisGet, redisSet, openaiCreate });
  const result = await summarizeText('hello world');

  assert.strictEqual(result, 'cached summary');
  assert.strictEqual(openaiCreate.mock.calls.length, 0);
  assert.strictEqual(redisSet.mock.calls.length, 0);
});

test('calls OpenAI and caches result on cache miss', async () => {
  const redisGet = mock.fn(async () => null);
  const redisSet = mock.fn(async () => {});
  const openaiCreate = mock.fn(async () => ({ output_text: 'fresh summary' }));

  const summarizeText = loadSummarizeText({ redisGet, redisSet, openaiCreate });
  const input = 'hello world';
  const result = await summarizeText(input);

  assert.strictEqual(result, 'fresh summary');
  assert.strictEqual(openaiCreate.mock.calls.length, 1);
  assert.strictEqual(redisSet.mock.calls.length, 1);

  const hash = crypto.createHash('sha256').update(input).digest('hex');
  assert.strictEqual(redisSet.mock.calls[0].arguments[0], `summary:${hash}`);
  assert.strictEqual(redisSet.mock.calls[0].arguments[1], 'fresh summary');
  assert.strictEqual(redisSet.mock.calls[0].arguments[2], 'EX');
});

test('handles Redis errors by falling back to OpenAI', async () => {
  const redisGet = mock.fn(async () => { throw new Error('redis fail'); });
  const redisSet = mock.fn(async () => {});
  const openaiCreate = mock.fn(async () => ({ output_text: 'summary from openai' }));

  const summarizeText = loadSummarizeText({ redisGet, redisSet, openaiCreate });
  const result = await summarizeText('some text');

  assert.strictEqual(result, 'summary from openai');
  assert.strictEqual(openaiCreate.mock.calls.length, 1);
  assert.strictEqual(redisSet.mock.calls.length, 1);
});

test('returns truncated text when OpenAI fails', async () => {
  const redisGet = mock.fn(async () => null);
  const redisSet = mock.fn();
  const openaiCreate = mock.fn(async () => { throw new Error('openai fail'); });

  const summarizeText = loadSummarizeText({ redisGet, redisSet, openaiCreate });
  const input = 'failure case';
  const result = await summarizeText(input);

  assert.strictEqual(result, input);
  assert.strictEqual(openaiCreate.mock.calls.length, 1);
  assert.strictEqual(redisSet.mock.calls.length, 0);
});
