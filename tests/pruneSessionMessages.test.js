const assert = require('assert');
const test = require('node:test');
const { mock } = test;

const constants = require('../config/constants');
constants.MAX_UNSUMMARIZED_MESSAGES = 3;

const user1 = { id: 'u1', longSummary: null };
const user2 = { id: 'u2', longSummary: null };

// Helper to create a message with simple text content
function msg(id, text) {
  return { id, role: 'user', content: [{ type: 'input_text', text }] };
}

// Session with too many unsummarized messages
const session1 = {
  id: 's1',
  userId: 'u1',
  messages: [
    msg('1', 'm1'),
    msg('2', 'm2'),
    msg('3', 'm3'),
    msg('4', 'm4'),
    msg('5', 'm5'),
  ],
  summary: null,
  lastSummarizedIndex: 0,
  user: user1,
};

// Session already within limits
const session2 = {
  id: 's2',
  userId: 'u2',
  messages: [msg('a', 'a'), msg('b', 'b')],
  summary: null,
  lastSummarizedIndex: 0,
  user: user2,
};

const sessions = [session1, session2];

const update = mock.fn(async ({ where, data }) => {
  const s = sessions.find((sess) => sess.id === where.id);
  Object.assign(s, data);
  return s;
});

const prismaMock = {
  chatSession: {
    findMany: async () => sessions,
    update,
  },
  user: {
    update: async ({ where, data }) => {
      const u = [user1, user2].find((usr) => usr.id === where.id);
      Object.assign(u, data);
      return u;
    },
  },
};

const summarizeSession = mock.fn(async ({ newMessages }) =>
  newMessages
    .map((m) => m.content?.[0]?.text || '')
    .join(' ')
    .trim()
);

require.cache[require.resolve('../lib/prisma.ts')] = { exports: prismaMock };
require.cache[require.resolve('../lib/server/summarizeSession.ts')] = {
  exports: { summarizeSession },
};

const { run } = require('../scripts/pruneSessionMessages.ts');

test('prunes excess session messages and skips sessions within limit', async () => {
  await run();

  // Session exceeding the limit is trimmed and summarized
  assert.deepStrictEqual(
    session1.messages.map((m) => m.content[0].text),
    ['m3', 'm4', 'm5']
  );
  assert.strictEqual(session1.summary, 'm1 m2');
  assert.strictEqual(session1.lastSummarizedIndex, 0);

  // Session within limit remains untouched
  assert.deepStrictEqual(
    session2.messages.map((m) => m.content[0].text),
    ['a', 'b']
  );
  assert.strictEqual(session2.summary, null);
  assert.strictEqual(session2.lastSummarizedIndex, 0);

  // Only one update should occur
  assert.strictEqual(update.mock.calls.length, 1);
  assert.strictEqual(update.mock.calls[0].arguments[0].where.id, 's1');
});

