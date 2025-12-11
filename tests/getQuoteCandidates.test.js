const assert = require('assert');
const { test, mock } = require('node:test');
const Module = require('module');
const path = require('path');

require('ts-node/register/transpile-only');
require('../scripts/register-tsconfig-paths.js');

const prismaModulePath = require.resolve('../lib/prisma.ts');
const originalPrismaModule = require.cache[prismaModulePath];

const prisma = {
  $disconnect: mock.fn(async () => {}),
  conversationMessage: {
    findMany: mock.fn(async () => []),
  },
};

const prismaStub = new Module(prismaModulePath, module);
prismaStub.filename = prismaModulePath;
prismaStub.paths = Module._nodeModulePaths(path.dirname(prismaModulePath));
prismaStub.loaded = true;
prismaStub.exports = { __esModule: true, default: prisma };

require.cache[prismaModulePath] = prismaStub;

const { getQuoteCandidates } = require('../lib/getQuoteCandidates.ts');
const conversationTranscript = require('../lib/getConversationTranscript.ts');

const getConversationTranscriptMock = mock.method(
  conversationTranscript,
  'getConversationTranscript',
  async () => []
);

test.after(async () => {
  await prisma.$disconnect();
  if (originalPrismaModule) {
    require.cache[prismaModulePath] = originalPrismaModule;
  } else {
    delete require.cache[prismaModulePath];
  }
});

test.beforeEach(() => {
  getConversationTranscriptMock.mock.resetCalls();
  getConversationTranscriptMock.mock.mockImplementation(async () => []);
});

test('getQuoteCandidates returns most recent snippets', async () => {
  const createdAtUser = new Date('2024-05-15T10:00:00Z');
  const createdAtAssistant = new Date('2024-05-15T10:05:00Z');

  getConversationTranscriptMock.mock.mockImplementationOnce(async () => [
    {
      messageId: 4002,
      sender: 'assistant',
      contentSnippet: 'Sure, I can take a look at that for you',
      quoteEligible: true,
      createdAt: createdAtAssistant,
    },
    {
      messageId: 4001,
      sender: 'user',
      contentSnippet: 'Need help with an installation',
      quoteEligible: true,
      createdAt: createdAtUser,
    },
    {
      messageId: 4000,
      sender: 'user',
      contentSnippet: '   ',
      quoteEligible: true,
      createdAt: createdAtUser,
    },
    {
      messageId: 3999,
      sender: 'assistant',
      contentSnippet: 'Private note content',
      quoteEligible: false,
      createdAt: createdAtAssistant,
    },
  ]);

  const result = await getQuoteCandidates('chatwoot:70:1:70', {
    conversation: { id: 70, inbox_id: 1 },
    message: { content_attributes: { channel: 'web_widget' } },
    userLimit: 4,
    assistantLimit: 2,
    maxCandidates: 3,
  });

  assert.deepStrictEqual(result, [
    {
      messageId: 4002,
      sender: 'assistant',
      snippet: 'Sure, I can take a look at that for you',
      createdAt: createdAtAssistant,
    },
    {
      messageId: 4001,
      sender: 'user',
      snippet: 'Need help with an installation',
      createdAt: createdAtUser,
    },
  ]);

  assert.strictEqual(getConversationTranscriptMock.mock.calls.length, 1);
  const [, options] = getConversationTranscriptMock.mock.calls[0].arguments;
  assert.deepStrictEqual(options, { userLimit: 4, assistantLimit: 2 });
});

test('getQuoteCandidates skips unsupported conversation channels', async () => {
  const result = await getQuoteCandidates('chatwoot:70:1:70', {
    conversation: { additional_attributes: { channel: 'sms' } },
    message: { content_attributes: { channel: 'web_widget' } },
  });

  assert.deepStrictEqual(result, []);
  assert.strictEqual(getConversationTranscriptMock.mock.calls.length, 0);
});

test('getQuoteCandidates skips unsupported message channels', async () => {
  const result = await getQuoteCandidates('chatwoot:70:1:70', {
    conversation: { id: 70, inbox_id: 1 },
    message: { channel: 'twilio_whatsapp' },
  });

  assert.deepStrictEqual(result, []);
  assert.strictEqual(getConversationTranscriptMock.mock.calls.length, 0);
});
