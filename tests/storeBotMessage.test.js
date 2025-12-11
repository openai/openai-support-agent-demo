const assert = require('assert');
const { test, mock } = require('node:test');
require('ts-node/register/transpile-only');
require('../scripts/register-tsconfig-paths.js');

const Module = require('module');
const path = require('path');

const storeAssistantMessageMock = mock.fn(async () => {});

const registerModuleMock =
  typeof mock.module === 'function'
    ? mock.module.bind(mock)
    : (specifier, exportsFactory) => {
        const resolved = require.resolve(specifier);
        delete require.cache[resolved];
        const mockedModule = new Module(resolved, module.parent);
        mockedModule.filename = resolved;
        mockedModule.paths = Module._nodeModulePaths(path.dirname(resolved));
        mockedModule.loaded = true;
        mockedModule.exports = exportsFactory();
        require.cache[resolved] = mockedModule;
      };

registerModuleMock('../lib/storeConversationMessage.ts', () => {
  function getNumericId(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return undefined;
      }
      const parsed = Number.parseInt(trimmed, 10);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
    return undefined;
  }

  return {
    getNumericId,
    storeAssistantMessage: storeAssistantMessageMock,
    default: storeAssistantMessageMock,
  };
});

const { storeBotMessage } = require('../lib/storeBotMessage.ts');

test('storeBotMessage persists Chatwoot response payloads', async () => {
  storeAssistantMessageMock.mock.resetCalls();
  const payload = {
    id: 42,
    source_id: 99,
    inbox_id: 7,
    content: 'Thanks for reaching out!',
    created_at: 1700000000,
  };

  const result = await storeBotMessage({
    accountId: 5,
    conversationId: 9,
    payload,
  });

  assert.deepStrictEqual(result, {
    stored: true,
    messageId: 42,
    inboxId: 7,
    sourceId: 99,
    conversationKey: 'chatwoot:5:7:9',
    content: 'Thanks for reaching out!',
  });

  assert.strictEqual(storeAssistantMessageMock.mock.calls.length, 1);
  const logCall = storeAssistantMessageMock.mock.calls[0].arguments[0];
  assert.deepStrictEqual(logCall, {
    accountId: 5,
    conversationId: 9,
    inboxId: 7,
    conversationKey: 'chatwoot:5:7:9',
    messageId: 42,
    content: 'Thanks for reaching out!',
    createdAt: 1700000000,
  });
});

test('storeBotMessage uses configured defaults when payload lacks identifiers', async () => {
  storeAssistantMessageMock.mock.resetCalls();

  const result = await storeBotMessage({
    accountId: 2,
    conversationId: 3,
    payload: {},
    fallbackContent: 'We will take it from here.',
    defaultMessageId: 123,
    defaultInboxId: 15,
  });

  assert.deepStrictEqual(result, {
    stored: true,
    messageId: 123,
    inboxId: 15,
    sourceId: undefined,
    conversationKey: 'chatwoot:2:15:3',
    content: 'We will take it from here.',
  });

  assert.strictEqual(storeAssistantMessageMock.mock.calls.length, 1);
  const defaultLog = storeAssistantMessageMock.mock.calls[0].arguments[0];
  assert.strictEqual(defaultLog.accountId, 2);
  assert.strictEqual(defaultLog.conversationId, 3);
  assert.strictEqual(defaultLog.inboxId, 15);
  assert.strictEqual(defaultLog.messageId, 123);
  assert.strictEqual(defaultLog.conversationKey, 'chatwoot:2:15:3');
  assert.strictEqual(defaultLog.content, 'We will take it from here.');
  assert.strictEqual(defaultLog.createdAt, undefined);
});

test('storeBotMessage skips persistence when identifiers are unavailable', async () => {
  storeAssistantMessageMock.mock.resetCalls();

  const result = await storeBotMessage({
    accountId: 1,
    conversationId: 2,
    payload: { content: 'Hello' },
  });

  assert.strictEqual(result, undefined);
  assert.strictEqual(storeAssistantMessageMock.mock.calls.length, 0);
});
