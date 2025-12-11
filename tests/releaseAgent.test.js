const assert = require('assert');
const { test, mock } = require('node:test');
require('ts-node/register/transpile-only');
require('../scripts/register-tsconfig-paths.js');

const originalChatwootUrl = process.env.CHATWOOT_URL;
process.env.CHATWOOT_URL = process.env.CHATWOOT_URL ?? 'https://chatwoot.example';

const agentListResponses = [];
const originalFetch = global.fetch;
const fetchMock = mock.method(global, 'fetch', async (input, init = {}) => {
  void init;
  const url =
    typeof input === 'string'
      ? input
      : typeof input === 'object' && input !== null && 'url' in input
        ? input.url
        : String(input);

  if (
    typeof url === 'string' &&
    url.includes('/api/v1/accounts/') &&
    url.includes('/agents')
  ) {
    const next = agentListResponses.length > 0 ? agentListResponses.shift() : { body: [] };
    const status = next.status ?? 200;
    const body = next.body ?? [];
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    return new Response(payload, {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

function enqueueAgentListResponse(body, status = 200) {
  agentListResponses.push({ body, status });
}

const conversationResolution = require('../lib/conversationResolution.ts');
const chatwoot = require('../lib/chatwoot.ts');
const chatwootBot = require('../lib/chatwootBot.ts');
const agentRotation = require('../lib/agentRotation.ts');
const handoffQueue = require('../lib/handoffQueue.ts');
const friendlyErrors = require('../lib/friendlyErrors.ts');
const prisma = require('../lib/prisma.ts').default;
const redis = require('../lib/redis.ts').default;
const { POST: statusWebhookPost } = require('../app/api/chatwoot-status-webhook/route.ts');
const { CONVO_LABELS } = require('../lib/constants.ts');

// Mock external dependencies
mock.method(chatwoot, 'getConversationLabels', async () => ({ payload: [] }));
mock.method(chatwoot, 'setConversationLabels', async () => {});
const getConversationMock = mock.method(
  chatwoot,
  'getConversation',
  async () => ({ inbox_id: inboxId })
);
const setAgentAvailabilityMock = mock.method(
  chatwoot,
  'setAgentAvailability',
  async () => {}
);
const clearActiveConversationMock = mock.method(
  agentRotation,
  'clearActiveConversation',
  async () => 'online'
);
const setActiveConversationMock = mock.method(
  agentRotation,
  'setActiveConversation',
  async () => {}
);
mock.method(handoffQueue, 'updateRequest', async () => {});

const accountId = 1;
const inboxId = 1;
const releasedConversationId = 1;
const queuedConversationId = 2;
const freedAgentId = 5;
const otherInboxId = 2;
const otherQueuedConversationId = 20;

prisma.agentAssignment.findFirst = mock.fn(async () => ({
  agentId: freedAgentId,
  inboxId,
}));
prisma.conversationMessage = {
  upsert: mock.fn(async () => ({})),
  findMany: mock.fn(async () => []),
};

const redisPipelineMock = {
  rpush: mock.fn(() => {}),
  expire: mock.fn(() => {}),
  exec: mock.fn(async () => {}),
};
redis.exists = mock.fn(async () => 0);
redis.pipeline = mock.fn(() => redisPipelineMock);

test.after(async () => {
  await prisma.$disconnect();
  if (typeof redis.disconnect === 'function') {
    redis.disconnect();
  }
  fetchMock.mock.restore?.();
  if (originalFetch) {
    global.fetch = originalFetch;
  } else {
    delete global.fetch;
  }
  if (originalChatwootUrl === undefined) {
    delete process.env.CHATWOOT_URL;
  } else {
    process.env.CHATWOOT_URL = originalChatwootUrl;
  }
});

test.beforeEach(() => {
  agentListResponses.length = 0;
  fetchMock.mock.resetCalls();
});

test('releaseAgent preserves non-status labels when clearing handoff labels', async () => {
  chatwoot.setConversationLabels.mock.resetCalls();
  chatwoot.getConversationLabels.mock.mockImplementationOnce(async () => ({
    payload: [
      CONVO_LABELS.complaint,
      'vip-customer',
      CONVO_LABELS.assigned,
      CONVO_LABELS.waiting,
    ],
  }));

  await conversationResolution.releaseAgent(accountId, releasedConversationId, {
    assignee_id: freedAgentId,
    inbox_id: inboxId,
  });

  const firstCall = chatwoot.setConversationLabels.mock.calls.at(0);
  assert.ok(firstCall, 'expected setConversationLabels to be called');
  assert.deepStrictEqual(firstCall.arguments, [
    accountId,
    releasedConversationId,
    [CONVO_LABELS.complaint, 'vip-customer'],
  ]);
});

test('releaseAgent preserves queued conversation labels when assigning next request', async () => {
  chatwoot.setConversationLabels.mock.resetCalls();
  chatwoot.getConversationLabels.mock.resetCalls();
  chatwoot.getConversationLabels.mock.mockImplementationOnce(async () => ({
    payload: [CONVO_LABELS.waiting],
  }));

  dequeueRequestMock.mock.mockImplementationOnce(async () => ({
    conversationId: queuedConversationId,
    conversationKey: `chatwoot:${accountId}:${inboxId}:${queuedConversationId}`,
    accountId,
    inboxId,
    requestedAt: new Date(),
    status: 'pending',
    agentId: null,
    lastPositionNotified: null,
    labels: [CONVO_LABELS.complaint, CONVO_LABELS.waiting],
  }));

  await conversationResolution.releaseAgent(accountId, releasedConversationId, {
    assignee_id: freedAgentId,
    inbox_id: inboxId,
  });

  const assignmentCall = chatwoot.setConversationLabels.mock.calls.find(
    (call) => call.arguments?.[1] === queuedConversationId
  );
  assert.ok(assignmentCall, 'expected labels to be set for queued conversation');
  assert.deepStrictEqual(assignmentCall.arguments, [
    accountId,
    queuedConversationId,
    [CONVO_LABELS.complaint, CONVO_LABELS.assigned],
  ]);
  assert.strictEqual(chatwoot.getConversationLabels.mock.calls.length, 1);
});

let status = 'resolved';

let nextMessageId = 0;

const dequeueRequestMock = mock.method(
  handoffQueue,
  'dequeueRequest',
  async () => ({
    conversationId: queuedConversationId,
    conversationKey: `chatwoot:${accountId}:${inboxId}:${queuedConversationId}`,
    accountId,
    inboxId,
    requestedAt: new Date(),
    status: 'pending',
    agentId: null,
    lastPositionNotified: null,
  })
);
const dequeueNextPendingRequestMock = mock.method(
  handoffQueue,
  'dequeueNextPendingRequest',
  async () => null
);
const updateQueuePositionsMock = mock.method(
  handoffQueue,
  'updateQueuePositions',
  async () => []
);
const toggleMock = mock.method(chatwootBot, 'toggleConversationStatus', async () => {
  status = 'open';
});
const assignMock = mock.method(chatwootBot, 'assignConversation', async () => {});
const sendMock = mock.method(
  chatwootBot,
  'sendBotMessage',
  async (accountIdArg, conversationIdArg, content) => {
    assert.strictEqual(status, 'open');
    return {
      id: ++nextMessageId,
      inbox_id: 1,
      content,
      conversation_id: conversationIdArg,
      account_id: accountIdArg,
      created_at: Math.floor(Date.now() / 1000),
    };
  }
);

function assertLoggedIds(...expectedIds) {
  const botMessages = prisma.conversationMessage.upsert.mock.calls
    .map((call) => call.arguments?.[0]?.create)
    .filter((create) => create && create.sender === 'bot');
  assert.strictEqual(botMessages.length, expectedIds.length);
  expectedIds.forEach((id, index) => {
    assert.strictEqual(botMessages[index].messageId, id);
  });
}

test('releaseAgent opens and assigns conversation before notifying', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  toggleMock.mock.resetCalls();
  assignMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  setAgentAvailabilityMock.mock.resetCalls();
  clearActiveConversationMock.mock.resetCalls();
  clearActiveConversationMock.mock.mockImplementation(async () => 'online');
  setActiveConversationMock.mock.resetCalls();
  const initialDequeueCalls = dequeueRequestMock.mock.calls.length;
  const initialToggleCalls = toggleMock.mock.calls.length;
  const initialAssignCalls = assignMock.mock.calls.length;
  const initialSendCalls = sendMock.mock.calls.length;
  const initialQueueUpdateCalls = updateQueuePositionsMock.mock.calls.length;
  updateQueuePositionsMock.mock.mockImplementationOnce(async () => [
    {
      conversationKey: `chatwoot:${accountId}:${inboxId}:3`,
      conversationId: 3,
      accountId,
      inboxId,
      requestedAt: new Date(),
      status: 'pending',
      agentId: null,
      lastPositionNotified: 2,
      position: 1,
    },
  ]);

  await conversationResolution.releaseAgent(accountId, releasedConversationId, {
    assignee_id: freedAgentId,
    inbox_id: inboxId,
  });

  assert.strictEqual(
    dequeueRequestMock.mock.calls.length,
    initialDequeueCalls + 1
  );
  assert.deepStrictEqual(dequeueRequestMock.mock.calls.at(-1).arguments, [
    accountId,
    inboxId,
  ]);
  assert.strictEqual(toggleMock.mock.calls.length, initialToggleCalls + 1);
  assert.deepStrictEqual(toggleMock.mock.calls.at(-1).arguments, [
    accountId,
    queuedConversationId,
    'open',
  ]);
  assert.strictEqual(assignMock.mock.calls.length, initialAssignCalls + 1);
  assert.deepStrictEqual(assignMock.mock.calls.at(-1).arguments, [
    accountId,
    queuedConversationId,
    freedAgentId,
  ]);
  assert.strictEqual(sendMock.mock.calls.length, initialSendCalls + 2);
  assert.strictEqual(
    sendMock.mock.calls.at(-1).arguments[2],
    'All human agents are currently busy. Please wait for the next available agent. You are currently number 1 in the queue.'
  );
  assert.strictEqual(
    updateQueuePositionsMock.mock.calls.length,
    initialQueueUpdateCalls + 1
  );
  assert.deepStrictEqual(updateQueuePositionsMock.mock.calls.at(-1).arguments, [
    { accountId },
  ]);
  assertLoggedIds(1, 2);
});

test('releaseAgent uses provided assignee and inbox without extra lookups', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  toggleMock.mock.resetCalls();
  assignMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  getConversationMock.mock.resetCalls();
  setAgentAvailabilityMock.mock.resetCalls();
  clearActiveConversationMock.mock.resetCalls();
  clearActiveConversationMock.mock.mockImplementation(async () => 'online');
  setActiveConversationMock.mock.resetCalls();

  await conversationResolution.releaseAgent(
    accountId,
    releasedConversationId,
    undefined,
    freedAgentId,
    inboxId
  );

  assert.strictEqual(getConversationMock.mock.calls.length, 0);
  assert.strictEqual(toggleMock.mock.calls.length, 1);
  assert.strictEqual(assignMock.mock.calls.length, 1);
  assert.ok(sendMock.mock.calls.length >= 1);
  assert.strictEqual(updateQueuePositionsMock.mock.calls.length, 1);
  assert.strictEqual(dequeueNextPendingRequestMock.mock.calls.length, 0);
  assertLoggedIds(1);
});

test('releaseAgent assigns next pending request from another inbox', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  toggleMock.mock.resetCalls();
  assignMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  setAgentAvailabilityMock.mock.resetCalls();
  clearActiveConversationMock.mock.resetCalls();
  clearActiveConversationMock.mock.mockImplementation(async () => 'online');
  setActiveConversationMock.mock.resetCalls();
  const initialDequeueCalls = dequeueRequestMock.mock.calls.length;
  const initialFallbackCalls = dequeueNextPendingRequestMock.mock.calls.length;
  const initialAssignCalls = assignMock.mock.calls.length;
  const initialQueueUpdateCalls = updateQueuePositionsMock.mock.calls.length;
  const initialSendCalls = sendMock.mock.calls.length;
  const fallbackRequest = {
    conversationId: otherQueuedConversationId,
    conversationKey: `chatwoot:${accountId}:${otherInboxId}:${otherQueuedConversationId}`,
    accountId,
    inboxId: otherInboxId,
    requestedAt: new Date(),
    status: 'pending',
    agentId: null,
    lastPositionNotified: null,
  };
  dequeueRequestMock.mock.mockImplementationOnce(async () => null);
  dequeueNextPendingRequestMock.mock.mockImplementationOnce(
    async () => fallbackRequest
  );
  updateQueuePositionsMock.mock.mockImplementationOnce(async () => [
    {
      ...fallbackRequest,
      conversationId: fallbackRequest.conversationId + 1,
      conversationKey: `chatwoot:${accountId}:${otherInboxId}:${fallbackRequest.conversationId + 1}`,
      lastPositionNotified: 2,
      position: 1,
    },
  ]);

  await conversationResolution.releaseAgent(accountId, releasedConversationId, {
    assignee_id: freedAgentId,
    inbox_id: inboxId,
  });

  assert.strictEqual(
    dequeueRequestMock.mock.calls.length,
    initialDequeueCalls + 1
  );
  assert.strictEqual(
    dequeueNextPendingRequestMock.mock.calls.length,
    initialFallbackCalls + 1
  );
  assert.deepStrictEqual(
    dequeueNextPendingRequestMock.mock.calls.at(-1).arguments,
    [accountId]
  );
  assert.strictEqual(assignMock.mock.calls.length, initialAssignCalls + 1);
  assert.deepStrictEqual(assignMock.mock.calls.at(-1).arguments, [
    accountId,
    otherQueuedConversationId,
    freedAgentId,
  ]);
  assert.strictEqual(
    updateQueuePositionsMock.mock.calls.length,
    initialQueueUpdateCalls + 1
  );
  assert.deepStrictEqual(updateQueuePositionsMock.mock.calls.at(-1).arguments, [
    { accountId },
  ]);
  assert.strictEqual(sendMock.mock.calls.length, initialSendCalls + 2);
  assert.strictEqual(sendMock.mock.calls.at(-2).arguments[1], otherQueuedConversationId);
  assert.strictEqual(
    sendMock.mock.calls.at(-1).arguments[1],
    fallbackRequest.conversationId + 1
  );
  assert.strictEqual(
    sendMock.mock.calls.at(-1).arguments[2],
    'All human agents are currently busy. Please wait for the next available agent. You are currently number 1 in the queue.'
  );
  assertLoggedIds(1, 2);
});

test('releaseAgent sends fallback when updateRequest fails', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  toggleMock.mock.resetCalls();
  assignMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  setAgentAvailabilityMock.mock.resetCalls();
  clearActiveConversationMock.mock.resetCalls();
  clearActiveConversationMock.mock.mockImplementation(async () => 'online');
  setActiveConversationMock.mock.resetCalls();
  handoffQueue.updateRequest.mock.mockImplementationOnce(async () => { throw new Error('fail'); });
  const notifyMock = mock.method(friendlyErrors, 'notifyHandoffIssue', async () => {});
  await conversationResolution.releaseAgent(accountId, releasedConversationId, {
    assignee_id: freedAgentId,
    inbox_id: inboxId,
  });
  assert.strictEqual(notifyMock.mock.calls.length, 1);
  assert.strictEqual(sendMock.mock.calls.length, 0);
  assertLoggedIds();
  notifyMock.mock.restore();
});

test('releaseAgent throws when freed agent cannot be resolved', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  setAgentAvailabilityMock.mock.resetCalls();
  clearActiveConversationMock.mock.resetCalls();
  clearActiveConversationMock.mock.mockImplementation(async () => 'online');
  setActiveConversationMock.mock.resetCalls();
  const fetchErr = new Error('fetch failed');
  getConversationMock.mock.mockImplementationOnce(async () => {
    throw fetchErr;
  });
  prisma.agentAssignment.findFirst.mock.mockImplementationOnce(async () => null);
  await assert.rejects(
    async () => {
      await conversationResolution.releaseAgent(accountId, releasedConversationId);
    },
    (err) => {
      assert.strictEqual(err.conversationId, releasedConversationId);
      assert.ok(err.message.includes(`conversation ${releasedConversationId}`));
      assert.ok(err.message.includes(fetchErr.message));
      return true;
    }
  );
  assertLoggedIds();
});

test('releaseAgent restores offline availability snapshot', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  toggleMock.mock.resetCalls();
  assignMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  dequeueRequestMock.mock.resetCalls();
  setAgentAvailabilityMock.mock.resetCalls();
  clearActiveConversationMock.mock.resetCalls();
  clearActiveConversationMock.mock.mockImplementationOnce(async () => 'offline');
  setActiveConversationMock.mock.resetCalls();
  dequeueRequestMock.mock.mockImplementationOnce(async () => null);

  await conversationResolution.releaseAgent(accountId, releasedConversationId, {
    assignee_id: freedAgentId,
    inbox_id: inboxId,
  });

  assert.strictEqual(clearActiveConversationMock.mock.calls.length, 1);
  assert.deepStrictEqual(
    setAgentAvailabilityMock.mock.calls.map((call) => call.arguments),
    [[accountId, freedAgentId, 'offline']]
  );
  assert.strictEqual(setActiveConversationMock.mock.calls.length, 0);
  assertLoggedIds();
});

test('releaseAgent records prior busy status when assigning queued request', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  toggleMock.mock.resetCalls();
  assignMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  setAgentAvailabilityMock.mock.resetCalls();
  clearActiveConversationMock.mock.resetCalls();
  clearActiveConversationMock.mock.mockImplementationOnce(async () => 'busy');
  setActiveConversationMock.mock.resetCalls();

  await conversationResolution.releaseAgent(accountId, releasedConversationId, {
    assignee_id: freedAgentId,
    inbox_id: inboxId,
  });

  assert.deepStrictEqual(
    setAgentAvailabilityMock.mock.calls.map((call) => call.arguments),
    [
      [accountId, freedAgentId, 'busy'],
      [accountId, freedAgentId, 'busy'],
    ]
  );
  assert.ok(setActiveConversationMock.mock.calls.length > 0);
  const lastActiveCall = setActiveConversationMock.mock.calls.at(-1).arguments;
  assert.strictEqual(lastActiveCall[0], freedAgentId);
  assert.strictEqual(lastActiveCall[1], queuedConversationId);
  assert.strictEqual(lastActiveCall[2], 'busy');
});

test('status change without label skips releaseAgent call', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  const consoleInfoMock = mock.method(console, 'info', () => {});
  const releaseAgentMock = mock.method(
    conversationResolution,
    'releaseAgent',
    async () => {}
  );
  const payload = {
    event: 'conversation_updated',
    data: {
      event: 'conversation_updated',
      changed_attributes: [
        {
          status: { previous_value: 'open', current_value: 'pending' },
        },
      ],
      account: { id: 10 },
      conversation: { id: 10 },
      assignee_id: 60,
    },
  };
  const req = new Request('http://localhost', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const res = await statusWebhookPost(req);
  const body = await res.json();
  assert.strictEqual(body.status, 'handled');
  assert.strictEqual(releaseAgentMock.mock.calls.length, 0);
  const resolvedFieldsCall = consoleInfoMock.mock.calls.find(
    (c) => c.arguments[0] === 'chatwoot status webhook resolved fields'
  );
  assert.ok(resolvedFieldsCall);
  assert.strictEqual(resolvedFieldsCall.arguments[1].status_previous, 'open');
  assert.strictEqual(resolvedFieldsCall.arguments[1].status_current, 'pending');
  assert.strictEqual(resolvedFieldsCall.arguments[1].labels_current, undefined);
  assert.strictEqual(resolvedFieldsCall.arguments[1].labels_previous, undefined);
  consoleInfoMock.mock.restore();
  releaseAgentMock.mock.restore();
  assertLoggedIds();
});

test('label removed with status open skips releaseAgent call', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  const consoleInfoMock = mock.method(console, 'info', () => {});
  const releaseAgentMock = mock.method(
    conversationResolution,
    'releaseAgent',
    async () => {}
  );
  const payload = {
    event: 'conversation_updated',
    data: {
      event: 'conversation_updated',
      changed_attributes: [
        {
          status: { previous_value: 'open', current_value: 'open' },
        },
        {
          label_list: {
            previous_value: [CONVO_LABELS.assigned],
            current_value: [],
          },
        },
      ],
      account: { id: 11 },
      conversation: { id: 11 },
      assignee_id: 61,
    },
  };
  enqueueAgentListResponse([
    { id: 61, availability_status: 'online' },
  ]);
  const req = new Request('http://localhost', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const res = await statusWebhookPost(req);
  const body = await res.json();
  assert.strictEqual(body.status, 'handled');
  assert.strictEqual(releaseAgentMock.mock.calls.length, 0);
  const resolvedFieldsCall = consoleInfoMock.mock.calls.find(
    (c) => c.arguments[0] === 'chatwoot status webhook resolved fields'
  );
  assert.ok(resolvedFieldsCall);
  assert.strictEqual(resolvedFieldsCall.arguments[1].status_previous, 'open');
  assert.strictEqual(resolvedFieldsCall.arguments[1].status_current, 'open');
  assert.deepStrictEqual(resolvedFieldsCall.arguments[1].labels_previous, [
    CONVO_LABELS.assigned,
  ]);
  assert.deepStrictEqual(resolvedFieldsCall.arguments[1].labels_current, []);
  consoleInfoMock.mock.restore();
  releaseAgentMock.mock.restore();
  assertLoggedIds();
});

test('status change with label triggers releaseAgent', async () => {
  nextMessageId = 0;
  prisma.conversationMessage.upsert.mock.resetCalls();
  sendMock.mock.resetCalls();
  updateQueuePositionsMock.mock.resetCalls();
  dequeueNextPendingRequestMock.mock.resetCalls();
  const consoleInfoMock = mock.method(console, 'info', () => {});
  const releaseAgentMock = mock.method(
    conversationResolution,
    'releaseAgent',
    async () => {}
  );
  const payload = {
    event: 'conversation_updated',
    data: {
      event: 'conversation_updated',
      changed_attributes: [
        {
          status: { previous_value: 'open', current_value: 'resolved' },
        },
        {
          label_list: {
            previous_value: [CONVO_LABELS.assigned],
            current_value: [CONVO_LABELS.assigned],
          },
        },
      ],
      account: { id: 12 },
      conversation: { id: 12 },
      assignee_id: 62,
    },
  };
  enqueueAgentListResponse([
    { id: 62, availability_status: 'online' },
  ]);
  const req = new Request('http://localhost', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const res = await statusWebhookPost(req);
  const body = await res.json();
  assert.strictEqual(body.status, 'handled');
  assert.strictEqual(releaseAgentMock.mock.calls.length, 1);
  const resolvedFieldsCall = consoleInfoMock.mock.calls.find(
    (c) => c.arguments[0] === 'chatwoot status webhook resolved fields'
  );
  assert.ok(resolvedFieldsCall);
  assert.strictEqual(resolvedFieldsCall.arguments[1].status_previous, 'open');
  assert.strictEqual(resolvedFieldsCall.arguments[1].status_current, 'resolved');
  assert.deepStrictEqual(resolvedFieldsCall.arguments[1].labels_previous, [
    CONVO_LABELS.assigned,
  ]);
  assert.deepStrictEqual(resolvedFieldsCall.arguments[1].labels_current, [
    CONVO_LABELS.assigned,
  ]);
  consoleInfoMock.mock.restore();
  releaseAgentMock.mock.restore();
  assertLoggedIds();
});
