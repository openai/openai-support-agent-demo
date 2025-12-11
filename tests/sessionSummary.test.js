const assert = require('assert');
const test = require('node:test');
const { mock } = test;

// Simulated session storage
const user = { id: 'u1', longSummary: null };
const session = {
  id: 's1',
  userId: 'u1',
  messages: [],
  summary: null,
  lastSummarizedIndex: 0,
  user,
};

// Mock prisma client with minimal ticket model for other tests
const prismaMock = {
  chatSession: {
    findUnique: async () => session,
    update: async ({ data }) => {
      Object.assign(session, data);
      return session;
    },
  },
  user: {
    update: async ({ data }) => {
      Object.assign(user, data);
      return user;
    },
  },
  ticket: {
    count: async () => 0,
    create: async () => ({}),
  },
};

// Mock saveSessionMessages to append to session.messages
async function saveSessionMessages(_id, msgs) {
  session.messages.push(...msgs);
  return { success: true };
}

// Mock summarizeSession to concat new message texts only
const summarizeSession = mock.fn(async ({ priorSummary, newMessages }) => {
  const text = newMessages
    .map((m) => m.content?.[0]?.text || '')
    .join(' ')
    .trim();
  return text;
});

// Mock redis set
const redisMock = { set: async () => {} };

// Inject mocks into require cache
require.cache[require.resolve('../lib/prisma.ts')] = { exports: prismaMock };
require.cache[require.resolve('../lib/redis.ts')] = { exports: redisMock };
require.cache[require.resolve('../lib/server/saveSessionMessages.ts')] = {
  exports: { saveSessionMessages },
};
require.cache[require.resolve('../lib/server/summarizeSession.ts')] = {
  exports: { summarizeSession },
};

async function endSession(messages) {
  const { POST } = await import('../app/api/sessions/[session_id]/end/route.ts');
  const req = new Request('http://test', {
    method: 'POST',
    body: JSON.stringify({ messages }),
    headers: { 'Content-Type': 'application/json' },
  });
  await POST(req, { params: Promise.resolve({ session_id: 's1' }) });
}

test('session summary only includes new messages and updates long summary', async () => {
  await endSession([
    { role: 'user', content: [{ type: 'input_text', text: 'hello' }] },
  ]);
  assert.strictEqual(session.summary, 'hello');
  assert.strictEqual(session.lastSummarizedIndex, 0);
  assert.strictEqual(user.longSummary, 'hello');
  assert.strictEqual(summarizeSession.mock.calls.length, 2);
  assert.deepStrictEqual(
    summarizeSession.mock.calls[0].arguments[0].newMessages.map((m) => m.content[0].text),
    ['hello']
  );
  assert.deepStrictEqual(
    summarizeSession.mock.calls[1].arguments[0].newMessages.map((m) => m.content[0].text),
    ['hello']
  );
  assert.strictEqual(
    summarizeSession.mock.calls[1].arguments[0].priorSummary,
    null
  );

  await endSession([
    { role: 'assistant', content: [{ type: 'output_text', text: 'there' }] },
  ]);
  assert.strictEqual(session.summary, 'hello\nthere');
  assert.strictEqual(session.lastSummarizedIndex, 0);
  assert.strictEqual(user.longSummary, 'hello\nthere');
  assert.strictEqual(summarizeSession.mock.calls.length, 4);
  assert.deepStrictEqual(
    summarizeSession.mock.calls[2].arguments[0].newMessages.map((m) => m.content[0].text),
    ['there']
  );
  assert.deepStrictEqual(
    summarizeSession.mock.calls[3].arguments[0].newMessages.map((m) => m.content[0].text),
    ['there']
  );
  assert.strictEqual(
    summarizeSession.mock.calls[3].arguments[0].priorSummary,
    'hello'
  );
});
