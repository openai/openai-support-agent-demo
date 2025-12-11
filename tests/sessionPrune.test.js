const assert = require('assert');
const test = require('node:test');
const { mock } = test;

const constants = require('../config/constants');
constants.MAX_UNSUMMARIZED_MESSAGES = 3;
constants.LARGE_MESSAGE_THRESHOLD = 50;

const user = { id: 'u1', longSummary: null };
const session = {
  id: 's1',
  userId: 'u1',
  messages: [],
  summary: null,
  lastSummarizedIndex: 0,
  unsummarizedLimit: constants.MAX_UNSUMMARIZED_MESSAGES,
  user,
};

const prismaMock = {
  chatSession: {
    findUnique: async () => session,
    update: async ({ data }) => {
      Object.assign(session, data);
      return session;
    },
    findMany: async () => [session], // for potential calls
  },
  user: {
    update: async ({ data }) => {
      Object.assign(user, data);
      return user;
    },
  },
};

const redisMock = { set: async () => {}, get: async () => null };

const summarizeSession = mock.fn(async ({ priorSummary, newMessages }) => {
  const text = newMessages
    .map((m) => m.content?.[0]?.text || '')
    .join(' ')
    .trim();
  return text;
});

require.cache[require.resolve('../lib/prisma.ts')] = { exports: prismaMock };
require.cache[require.resolve('../lib/redis.ts')] = { exports: redisMock };
require.cache[require.resolve('../lib/server/summarizeSession.ts')] = {
  exports: { summarizeSession },
};

const { saveSessionMessages } = require('../lib/server/saveSessionMessages.ts');

function reset() {
  session.messages = [];
  session.summary = null;
  session.lastSummarizedIndex = 0;
  session.unsummarizedLimit = constants.MAX_UNSUMMARIZED_MESSAGES;
  user.longSummary = null;
  summarizeSession.mock.resetCalls();
}

test('saveSessionMessages prunes old unsummarized messages', async () => {
  reset();
  const msgs = [
    { id: '1', role: 'user', content: [{ type: 'input_text', text: 'm1' }] },
    { id: '2', role: 'assistant', content: [{ type: 'output_text', text: 'm2' }] },
    { id: '3', role: 'user', content: [{ type: 'input_text', text: 'm3' }] },
    { id: '4', role: 'assistant', content: [{ type: 'output_text', text: 'm4' }] },
    { id: '5', role: 'user', content: [{ type: 'input_text', text: 'm5' }] },
  ];
  await saveSessionMessages('s1', msgs);
  assert.strictEqual(session.summary, 'm1 m2');
  assert.strictEqual(session.lastSummarizedIndex, 0);
  assert.deepStrictEqual(
    session.messages.map((m) => m.content[0].text),
    ['m3', 'm4', 'm5']
  );
  assert.strictEqual(session.unsummarizedLimit, 3);
  assert.strictEqual(summarizeSession.mock.calls.length, 1);
});

test('end session removes messages after summarization and resets limit', async () => {
  reset();
  session.unsummarizedLimit = 1;
  session.messages = [
    { role: 'user', content: [{ type: 'input_text', text: 'hi' }] },
    { role: 'assistant', content: [{ type: 'output_text', text: 'there' }] },
  ];
  const { POST } = await import('../app/api/sessions/[session_id]/end/route.ts');
  const req = new Request('http://test', {
    method: 'POST',
    body: JSON.stringify({ messages: [] }),
    headers: { 'Content-Type': 'application/json' },
  });
  await POST(req, { params: Promise.resolve({ session_id: 's1' }) });
  assert.deepStrictEqual(session.messages, []);
  assert.strictEqual(session.summary, 'hi there');
  assert.strictEqual(session.lastSummarizedIndex, 0);
  assert.strictEqual(
    session.unsummarizedLimit,
    constants.MAX_UNSUMMARIZED_MESSAGES
  );
});

test('unsummarized limit shrinks after repeated large messages and prunes', async () => {
  reset();
  const large1 = { id: 'l1', role: 'assistant', content: [{ type: 'output_text', text: 'x'.repeat(60) }] };
  const large2 = { id: 'l2', role: 'assistant', content: [{ type: 'output_text', text: 'y'.repeat(60) }] };
  const large3 = { id: 'l3', role: 'assistant', content: [{ type: 'output_text', text: 'z'.repeat(60) }] };
  await saveSessionMessages('s1', [large1]);
  assert.strictEqual(session.unsummarizedLimit, 3);
  await saveSessionMessages('s1', [large2]);
  assert.strictEqual(session.unsummarizedLimit, 2);
  await saveSessionMessages('s1', [large3]);
  assert.strictEqual(session.unsummarizedLimit, 1);
  await saveSessionMessages('s1', [
    { id: '4', role: 'user', content: [{ type: 'input_text', text: 'ok' }] },
  ]);
  assert.strictEqual(session.unsummarizedLimit, 1);
  assert.ok(session.summary.includes('x'));
  assert.ok(session.summary.includes('y'));
  assert.ok(session.summary.includes('z'));
  assert.deepStrictEqual(
    session.messages.map((m) => m.content[0].text),
    ['ok']
  );
});
