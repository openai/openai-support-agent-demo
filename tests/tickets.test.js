const assert = require('assert');
const test = require('node:test');
require('ts-node/register/transpile-only');
require('../scripts/register-tsconfig-paths.js');

// Provide a lightweight Prisma stub to avoid loading native engine
const prisma = { ticket: { count: async () => 0, create: async () => ({}) } };
require.cache[require.resolve('../lib/prisma.ts')] = { exports: prisma };

const { POST } = require('../app/api/tickets/create/route.ts');
const { create_ticket } = require('../config/functions.ts');
const useDataStore = require('../stores/useDataStore').default;

test('create ticket route success returns JSON', async () => {
  const originalCount = prisma.ticket.count;
  const originalCreate = prisma.ticket.create;
  prisma.ticket.count = async () => 0;
  prisma.ticket.create = async () => ({});
  try {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    const data = JSON.parse(text);
    assert.ok(data.ticket_id);
  } finally {
    prisma.ticket.count = originalCount;
    prisma.ticket.create = originalCreate;
  }
});

test('create ticket route error returns JSON', async () => {
  const originalCount = prisma.ticket.count;
  const originalError = console.error;
  console.error = () => {};
  prisma.ticket.count = async () => {
    throw new Error('db error');
  };
  try {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 500);
    const text = await res.text();
    const data = JSON.parse(text);
    assert.deepStrictEqual(data, { error: 'Error creating ticket' });
  } finally {
    prisma.ticket.count = originalCount;
    console.error = originalError;
  }
});

test('create_ticket handles success', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response(JSON.stringify({ ticket_id: 'T1' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  try {
    useDataStore.setState({ contactType: null, contactId: null });
    const result = await create_ticket();
    assert.strictEqual(result, 'Your ticket ID is T1');
    const state = useDataStore.getState();
    assert.strictEqual(state.contactType, 'ticket');
    assert.strictEqual(state.contactId, 'T1');
  } finally {
    global.fetch = originalFetch;
    useDataStore.setState({ contactType: null, contactId: null });
  }
});

test('create_ticket surfaces API errors', async () => {
  const originalFetch = global.fetch;
  const originalError = console.error;
  console.error = () => {};
  global.fetch = async () =>
    new Response(JSON.stringify({ error: 'Error creating ticket' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  try {
    const result = await create_ticket();
    assert.deepStrictEqual(result, { error: 'Error creating ticket' });
  } finally {
    global.fetch = originalFetch;
    console.error = originalError;
  }
});
